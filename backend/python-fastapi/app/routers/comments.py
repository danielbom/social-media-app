from fastapi import APIRouter

from app import models

router = APIRouter(prefix='/comments', tags=['Comments'])


@router.post('/')
def create_comment(comment: models.CreateComment):
    return {'content': comment.content, 'post_id': comment.postId}


@router.post('/asnwer/')
def create_comment_answer(comment: models.CreateCommentAnswer):
    return {'content': comment.content, 'comment_id': comment.commentId}


@router.get('/')
def get_comments():
    return {'comments': 'comments'}


@router.get('/{comment_id}')
def get_comment(comment_id: str):
    return {'comment': comment_id}


@router.patch('/{comment_id}')
def update_comment(comment_id: str, updates: models.UpdateComment):
    return {'comment': comment_id, 'body': updates}


@router.delete('/{comment_id}')
def delete_comment(comment_id: str):
    return {'comment': comment_id}
