import uuid
from datetime import datetime
from http.client import HTTPException

from fastapi import APIRouter, Depends

from app import dto, models
from app.database import Session, get_db

router = APIRouter(prefix='/posts', tags=['Posts'])


@router.post('/')
def create_post(post: dto.CreatePost, db: Session = Depends(get_db)):
    post = models.Post(
        id=str(uuid.uuid4()),
        content=post.content,
        createdAt=datetime.now(),
        updatedAt=datetime.now(),
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.get('/')
def get_posts(db: Session = Depends(get_db)):
    return db.query(models.Post).all()


@router.get('/{post_id}')
def get_post(post_id: str, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail='Post not found')
    return post


@router.patch('/{post_id}')
def update_post(
    post_id: str, updates: dto.UpdatePost, db: Session = Depends(get_db)
):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail='Post not found')
    post.content = updates.content
    post.updatedAt = datetime.now()
    db.commit()
    db.refresh(post)
    return post


@router.delete('/{post_id}')
def delete_post(post_id: str, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail='Post not found')
    db.delete(post)
    db.commit()
    return post
