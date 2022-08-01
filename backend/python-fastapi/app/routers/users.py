import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException

from app import dto, models
from app.database import Session, get_db

router = APIRouter(prefix='/users', tags=['Users'])


@router.post('/')
def create_user(body: dto.CreateUser, db: Session = Depends(get_db)):
    new_user = models.User(
        id=str(uuid.uuid4()),
        username=body.username,
        password=body.password,
        role=body.role,
        createdAt=datetime.now(),
        updatedAt=datetime.now(),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.get('/')
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


@router.get('/{user_id}')
def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    return user


@router.patch('/{user_id}')
def update_user(
    user_id: str, updates: dto.UpdateUser, db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    user.username = updates.username
    user.password = updates.password
    user.role = updates.role
    user.updatedAt = datetime.now()
    db.commit()
    db.refresh(user)
    return user


@router.delete('/{user_id}')
def delete_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    db.delete(user)
    db.commit()
    return user
