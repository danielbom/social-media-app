import uuid
from datetime import datetime
from http.client import HTTPException

from fastapi import APIRouter, Depends

from app import dto, models
from app.database import Session, get_db

router = APIRouter(prefix='/comments', tags=['Comments'])


@router.post('/')
def create_comment(body: dto.CreateComment, db: Session = Depends(get_db)):
    comment = models.Comment(
        id=str(uuid.uuid4()),
        content=body.content,
        createdAt=datetime.now(),
        updatedAt=datetime.now(),
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


@router.post('/asnwer/')
def create_comment_answer(
    body: dto.CreateCommentAnswer, db: Session = Depends(get_db)
):
    comment_awnser = models.Comment(
        id=str(uuid.uuid4()),
        content=body.content,
        commentParentId=body.commentId,
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
    comment_id: str, updates: dto.UpdateComment, db: Session = Depends(get_db)
):
    comment = (
        db.query(models.Comment)
        .filter(models.Comment.id == comment_id)
        .first()
    )
    if not comment:
        raise HTTPException(status_code=404, detail='Comment not found')
    comment.content = updates.content
    comment.updatedAt = datetime.now()
    db.commit()
    db.refresh(comment)
    return comment


@router.delete('/{comment_id}')
def delete_comment(comment_id: str, db: Session = Depends(get_db)):
    comment = (
        db.query(models.Comment)
        .filter(models.Comment.id == comment_id)
        .first()
    )
    if not comment:
        raise HTTPException(status_code=404, detail='Comment not found')
    db.delete(comment)
    db.commit()
    return comment
