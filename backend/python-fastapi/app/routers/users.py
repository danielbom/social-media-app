import uuid
from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from app import models, schemas
from app.database import Session, get_db
from app.library.auth import ensure_role
from app.services import crypt, jwt

router = APIRouter(prefix='/users', tags=['Users'])


@router.post(
    '/', status_code=status.HTTP_201_CREATED, response_model=schemas.User
)
def create_user(
    body: schemas.CreateUser,
    db: Session = Depends(get_db),
    token_data: schemas.TokenData = Depends(jwt.decode_token),
):
    ensure_role(token_data, ['admin'])

    body.password = crypt.hash_password(body.password)
    new_user = models.User(
        id=str(uuid.uuid4()),
        username=body.username,
        password=body.password,
        role=body.role,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.get('/', response_model=List[schemas.User])
def get_users(
    db: Session = Depends(get_db),
    token_data: schemas.TokenData = Depends(jwt.decode_token),
):
    ensure_role(token_data, ['admin'])
    return db.query(models.User).all()


@router.get('/{user_id}', response_model=schemas.User)
def get_user(
    user_id: str,
    db: Session = Depends(get_db),
    token_data: schemas.TokenData = Depends(jwt.decode_token),
) -> models.User:
    ensure_role(token_data, ['admin'])
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    return user


@router.patch('/{user_id}', response_model=schemas.User)
def update_user(
    user_id: str,
    updates: schemas.UpdateUser,
    db: Session = Depends(get_db),
    token_data: schemas.TokenData = Depends(jwt.decode_token),
):
    ensure_role(token_data, ['admin'])
    user = get_user(user_id, db)
    user.username = updates.username
    user.password = updates.password
    user.role = updates.role
    user.updated_at = datetime.now()
    db.commit()
    db.refresh(user)
    return user


@router.delete('/{user_id}', response_model=schemas.User)
def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    token_data: schemas.TokenData = Depends(jwt.decode_token),
):
    ensure_role(token_data, ['admin'])
    user = get_user(user_id, db)
    db.delete(user)
    db.commit()
    return user
