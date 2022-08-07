import uuid
from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status

from app import models, schemas
from app.database import Session, get_db
from app.guards.role import role_guard
from app.services import crypt

router = APIRouter(prefix='/users', tags=['Users'])


@router.post(
    '/',
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.User,
    dependencies=[Depends(role_guard(['admin']))],
)
def create_user(body: schemas.CreateUser, db: Session = Depends(get_db)):
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


@router.get(
    '/',
    response_model=List[schemas.User],
    dependencies=[Depends(role_guard(['admin']))],
)
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


@router.get(
    '/{user_id}',
    response_model=schemas.User,
    dependencies=[Depends(role_guard(['admin']))],
)
def get_user(user_id: str, db: Session = Depends(get_db)) -> models.User:
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    return user


@router.patch(
    '/{user_id}',
    response_model=schemas.User,
    dependencies=[Depends(role_guard(['admin']))],
)
def update_user(
    user_id: str, updates: schemas.UpdateUser, db: Session = Depends(get_db)
):
    user = get_user(user_id, db)
    user.username = updates.username
    user.password = updates.password
    user.role = updates.role
    user.updated_at = datetime.now()
    db.commit()
    db.refresh(user)
    return user


@router.delete(
    '/{user_id}',
    dependencies=[Depends(role_guard(['admin']))],
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
def delete_user(user_id: str, db: Session = Depends(get_db)):
    user = get_user(user_id, db)
    db.delete(user)
    db.commit()
