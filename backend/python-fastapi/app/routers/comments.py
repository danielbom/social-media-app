import uuid
from datetime import datetime
from typing import List, cast

from fastapi import APIRouter, Depends, HTTPException, Response, status

from app import models, schemas
from app.database import Session, get_db
from app.library.auth import ensure_user_data
from app.services import jwt

router = APIRouter(prefix='/comments', tags=['Comments'])


@router.post(
    '/', response_model=schemas.Comment, status_code=status.HTTP_201_CREATED
)
def create_comment(
    body: schemas.CreateComment,
    db: Session = Depends(get_db),
    token_data: schemas.TokenData = Depends(jwt.decode_token),
) -> models.Comment:
    comment = models.Comment(
        id=str(uuid.uuid4()),
        content=body.content,
        post_parent_id=body.post_id,
        comment_parent_id=None,
        author_id=token_data.user_id,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


@router.post(
    '/answer/',
    response_model=schemas.Comment,
    status_code=status.HTTP_201_CREATED,
)
def create_comment_answer(
    body: schemas.CreateCommentAnswer,
    db: Session = Depends(get_db),
    token_data: schemas.TokenData = Depends(jwt.decode_token),
) -> models.Comment:
    get_comment(body.comment_id, db)

    comment_awnser = models.Comment(
        id=str(uuid.uuid4()),
        content=body.content,
        post_parent_id=None,
        comment_parent_id=body.comment_id,
        author_id=token_data.user_id,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    db.add(comment_awnser)
    db.commit()
    db.refresh(comment_awnser)
    return comment_awnser


@router.get('/', response_model=List[schemas.Comment])
def get_comments(
    db: Session = Depends(get_db), page: int = 1, page_size: int = 10
) -> List[schemas.Comment]:
    offset = (page - 1) * page_size
    query = db.query(models.Comment).offset(offset).limit(page_size)
    return cast(List[schemas.Comment], query.all())


@router.get('/{comment_id}', response_model=schemas.Comment)
def get_comment(comment_id: str, db: Session = Depends(
        get_db)) -> models.Comment:
    comment = (
        db.query(models.Comment)
        .filter(models.Comment.id == comment_id)
        .first()
    )
    if comment is None:
        raise HTTPException(status_code=404, detail='Comment not found')
    return cast(models.Comment, comment)


@router.patch('/{comment_id}', response_model=schemas.Comment)
def update_comment(
    comment_id: str,
    updates: schemas.UpdateComment,
    db: Session = Depends(get_db),
    token_data: schemas.TokenData = Depends(jwt.decode_token),
) -> models.Comment:
    comment = get_comment(comment_id, db)
    ensure_user_data(token_data, comment.author_id)
    comment.content = updates.content
    comment.updatedAt = datetime.now()
    db.commit()
    db.refresh(comment)
    return comment


@router.delete(
    '/{comment_id}',
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
def delete_comment(
    comment_id: str,
    db: Session = Depends(get_db),
    token_data: schemas.TokenData = Depends(jwt.decode_token),
) -> None:
    comment = get_comment(comment_id, db)
    ensure_user_data(token_data, comment.author_id)
    db.query(models.Comment).where(models.Comment.id == comment_id).delete()
    db.commit()
