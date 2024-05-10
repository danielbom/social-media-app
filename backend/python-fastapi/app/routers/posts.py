import uuid
from datetime import datetime
from typing import List, cast

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import func
from sqlalchemy.sql import and_

from app import models, schemas
from app.database import Session, get_db
from app.library.auth import ensure_user_data
from app.services import jwt

router = APIRouter(prefix='/posts', tags=['Posts'])


def post_must_exists(post: models.Post | None) -> None:
    if not post:
        raise HTTPException(status_code=404, detail='Post not found')


@router.post('/', response_model=schemas.Post)
def create_post(
    post: schemas.CreatePost,
    db: Session = Depends(get_db),
    token_data: schemas.TokenData = Depends(jwt.decode_token),
) -> models.Post:
    post = models.Post(
        id=str(uuid.uuid4()),
        content=post.content,
        author_id=token_data.user_id,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.get('/', response_model=List[schemas.PostLike])
def get_posts(
    db: Session = Depends(get_db),
    _: schemas.TokenData = Depends(jwt.decode_token),
    page: int = 1,
    page_size: int = 10,
) -> List[models.PostLike]:
    offset = (page - 1) * page_size
    query = (
        db.query(
            models.Post, func.count(models.PostLike.post_id).label('likes')
        )
        .join(
            models.PostLike,
            models.PostLike.post_id == models.Post.id,
            isouter=True,
        )
        .group_by(models.Post.id)
        .offset(offset)
        .limit(page_size)
    )
    return cast(List[models.PostLike], query.all())


@router.get('/{post_id}', response_model=schemas.PostLike)
def get_post(
    post_id: str,
    db: Session = Depends(get_db),
    _: schemas.TokenData = Depends(jwt.decode_token),
) -> models.PostLike:
    post = (
        db.query(
            models.Post, func.count(models.PostLike.post_id).label('likes')
        )
        .join(
            models.PostLike,
            models.PostLike.post_id == models.Post.id,
            isouter=True,
        )
        .where(models.Post.id == post_id)
        .group_by(models.Post.id)
        .first()
    )
    post_must_exists(post)
    return cast(models.PostLike, post)


@router.patch('/{post_id}', response_model=schemas.Post)
def update_post(
    post_id: str,
    updates: schemas.UpdatePost,
    db: Session = Depends(get_db),
    token_data: schemas.TokenData = Depends(jwt.decode_token),
) -> models.Post:
    post = db.query(models.Post).where(models.Post.id == post_id).first()
    post_must_exists(post)
    ensure_user_data(token_data, post.author_id)
    post.content = updates.content
    post.updated_at = datetime.now()
    db.commit()
    db.refresh(post)
    return cast(models.Post, post)


@router.delete(
    '/{post_id}',
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
def delete_post(
    post_id: str,
    db: Session = Depends(get_db),
    token_data: schemas.TokenData = Depends(jwt.decode_token),
) -> None:
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    post_must_exists(post)
    ensure_user_data(token_data, post.author_id)
    db.delete(post)
    db.commit()


def has_post_like(
    post_id: str,
    user_id: str,
    db: Session,
) -> models.PostLike:
    post_like = (
        db.query(models.PostLike)
        .where(
            and_(
                models.PostLike.post_id == post_id,
                models.PostLike.user_id == user_id,
            )
        )
        .first()
    )
    return cast(models.PostLike, post_like)


@router.get('/{post_id}/like')
def get_post_like(
    post_id: str,
    db: Session = Depends(get_db),
    _: schemas.TokenData = Depends(jwt.decode_token),
) -> dict[str, str]:
    post_likes = (
        db.query(models.PostLike).where(models.PostLike.post_id == post_id)
    ).count()
    return {'likes': post_likes}


@router.post('/{post_id}/like')
def add_post_like(
    post_id: str,
    db: Session = Depends(get_db),
    token_data: schemas.TokenData = Depends(jwt.decode_token),
) -> dict[str, str]:
    has_like = has_post_like(post_id, token_data.user_id, db)
    if has_like:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='You already liked this post',
        )
    post_like = models.PostLike(user_id=token_data.user_id, post_id=post_id)
    db.add(post_like)
    db.commit()
    return {'message': 'Like added'}


@router.delete('/{post_id}/like')
def remove_post_like(
    post_id: str,
    db: Session = Depends(get_db),
    token_data: schemas.TokenData = Depends(jwt.decode_token),
) -> dict[str, str]:
    has_like = has_post_like(post_id, token_data.user_id, db)
    if not has_like:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='You did not like this post',
        )
    db.delete(has_like)
    db.commit()
    return {'message': 'Like removed'}
