import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException

from app import models, schemas
from app.database import Session, get_db

router = APIRouter(prefix='/comments', tags=['Comments'])


@router.post('/')
def create_comment(body: schemas.CreateComment, db: Session = Depends(get_db)):
    comment = models.Comment(
        id=str(uuid.uuid4()),
        content=body.content,
        postParentId=body.postId,
        commentParentId=None,
        likes=0,
        authorId='',
        createdAt=datetime.now(),
        updatedAt=datetime.now(),
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


@router.post('/answer/')
def create_comment_answer(
    body: schemas.CreateCommentAnswer, db: Session = Depends(get_db)
):
    comment_awnser = models.Comment(
        id=str(uuid.uuid4()),
        content=body.content,
        postParentId=None,
        commentParentId=body.commentId,
        likes=0,
        authorId='',
        createdAt=datetime.now(),
        updatedAt=datetime.now(),
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
):
    comment = get_comment(comment_id, db)
    comment.content = updates.content
    comment.updatedAt = datetime.now()
    db.commit()
    db.refresh(comment)
    return comment


@router.delete('/{comment_id}')
def delete_comment(comment_id: str, db: Session = Depends(get_db)):
    comment = get_comment(comment_id, db)
    db.delete(comment)
    db.commit()
    return comment
