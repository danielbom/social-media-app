import uuid
from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status

from app import models, schemas
from app.database import Session, get_db
from app.library.auth import ensure_user_data
from app.services import jwt

router = APIRouter(prefix='/posts', tags=['Posts'])


@router.post('/', response_model=schemas.Post)
def create_post(
    post: schemas.CreatePost,
    db: Session = Depends(get_db),
    token_data: schemas.TokenData = Depends(jwt.decode_token),
):
    post = models.Post(
        id=str(uuid.uuid4()),
        content=post.content,
        likes=0,
        author_id=token_data.user_id,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.get('/', response_model=List[schemas.Post])
def get_posts(
    db: Session = Depends(get_db),
    _: schemas.TokenData = Depends(jwt.decode_token),
    page: int = 1,
    page_size: int = 10,
):
    offset = (page - 1) * page_size
    query = db.query(models.Post).offset(offset).limit(page_size)
    return query.all()


@router.get('/{post_id}', response_model=schemas.Post)
def get_post(
    post_id: str,
    db: Session = Depends(get_db),
    _: schemas.TokenData = Depends(jwt.decode_token),
):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail='Post not found')
    return post


@router.patch('/{post_id}', response_model=schemas.Post)
def update_post(
    post_id: str,
    updates: schemas.UpdatePost,
    db: Session = Depends(get_db),
    token_data: schemas.TokenData = Depends(jwt.decode_token),
):
    post = get_post(post_id, db)
    ensure_user_data(token_data, post.author_id)
    post.content = updates.content
    post.updated_at = datetime.now()
    db.commit()
    db.refresh(post)
    return post


@router.delete(
    '/{post_id}',
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
def delete_post(
    post_id: str,
    db: Session = Depends(get_db),
    token_data: schemas.TokenData = Depends(jwt.decode_token),
):
    post = get_post(post_id, db)
    ensure_user_data(token_data, post.author_id)
    db.delete(post)
    db.commit()
