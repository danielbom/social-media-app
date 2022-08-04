from re import I
import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException

from app import models, schemas
from app.database import Session, get_db
from app.library.auth import ensure_user_data
from app.services import jwt

router = APIRouter(prefix='/posts', tags=['Posts'])


@router.post('/')
def create_post(
    post: schemas.CreatePost,
    db: Session = Depends(get_db),
    token_data: schemas.TokenData = Depends(jwt.decode_token),
):
    post = models.Post(
        id=str(uuid.uuid4()),
        content=post.content,
        likes=0,
        authorId=token_data.user_id,
        createdAt=datetime.now(),
        updatedAt=datetime.now(),
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.get('/')
def get_posts(
    db: Session = Depends(get_db),
    _: schemas.TokenData = Depends(jwt.decode_token),
):
    return db.query(models.Post).all()


@router.get('/{post_id}')
def get_post(
    post_id: str,
    db: Session = Depends(get_db),
    _: schemas.TokenData = Depends(jwt.decode_token),
):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail='Post not found')
    return post


@router.patch('/{post_id}')
def update_post(
    post_id: str,
    updates: schemas.UpdatePost,
    db: Session = Depends(get_db),
    token_data: schemas.TokenData = Depends(jwt.decode_token),
):
    post = get_post(post_id, db)
    ensure_user_data(token_data, post.authorId)
    post.content = updates.content
    post.updatedAt = datetime.now()
    db.commit()
    db.refresh(post)
    return post


@router.delete('/{post_id}')
def delete_post(
    post_id: str,
    db: Session = Depends(get_db),
    token_data: schemas.TokenData = Depends(jwt.decode_token),
):
    post = get_post(post_id, db)
    ensure_user_data(token_data, post.authorId)
    db.delete(post)
    db.commit()
    return post
