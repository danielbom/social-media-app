import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException

from app import models, schemas
from app.library.auth import ensure_user_data
from app.database import Session, get_db
from app.services import jwt

router = APIRouter(prefix='/comments', tags=['Comments'])


@router.post('/')
def create_comment(
    body: schemas.CreateComment,
    db: Session = Depends(get_db),
    token_data: schemas.TokenData = Depends(jwt.decode_token),
):
    comment = models.Comment(
        id=str(uuid.uuid4()),
        content=body.content,
        post_parent_id=body.post_id,
        comment_parent_id=None,
        likes=0,
        author_id=token_data.user_id,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


@router.post('/answer/')
def create_comment_answer(
    body: schemas.CreateCommentAnswer,
    db: Session = Depends(get_db),
    token_data: schemas.TokenData = Depends(jwt.decode_token),
):
    comment_awnser = models.Comment(
        id=str(uuid.uuid4()),
        content=body.content,
        post_parent_id=None,
        comment_parent_id=body.comment_id,
        likes=0,
        author_id=token_data.user_id,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    db.add(comment_awnser)
    db.commit()
    db.refresh(comment_awnser)
    return comment_awnser


@router.get('/')
def get_comments(db: Session = Depends(get_db)):
    return db.query(models.Comment).all()


@router.get('/{comment_id}')
def get_comment(comment_id: str, db: Session = Depends(get_db)):
    comment = (
        db.query(models.Comment)
        .filter(models.Comment.id == comment_id)
        .first()
    )
    if not comment:
        raise HTTPException(status_code=404, detail='Comment not found')
    return comment


@router.patch('/{comment_id}')
def update_comment(
    comment_id: str,
    updates: schemas.UpdateComment,
    db: Session = Depends(get_db),
    token_data: schemas.TokenData = Depends(jwt.decode_token),
):
    comment = get_comment(comment_id, db)
    ensure_user_data(token_data, comment.author_id)
    comment.content = updates.content
    comment.updatedAt = datetime.now()
    db.commit()
    db.refresh(comment)
    return comment


@router.delete('/{comment_id}')
def delete_comment(
    comment_id: str,
    db: Session = Depends(get_db),
    token_data: schemas.TokenData = Depends(jwt.decode_token),
):
    comment = get_comment(comment_id, db)
    ensure_user_data(token_data, comment.author_id)
    db.delete(comment)
    db.commit()
    return comment
