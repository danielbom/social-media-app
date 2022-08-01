from fastapi import APIRouter

from app import dto

router = APIRouter(prefix='/comments', tags=['Comments'])


@router.post('/')
def create_comment(comment: dto.CreateComment):
    return {'content': comment.content, 'post_id': comment.postId}


@router.post('/asnwer/')
def create_comment_answer(comment: dto.CreateCommentAnswer):
    return {'content': comment.content, 'comment_id': comment.commentId}


@router.get('/')
def get_comments():
    return {'comments': 'comments'}


@router.get('/{comment_id}')
def get_comment(comment_id: str):
    return {'comment': comment_id}


@router.patch('/{comment_id}')
def update_comment(comment_id: str, updates: dto.UpdateComment):
    return {'comment': comment_id, 'body': updates}


@router.delete('/{comment_id}')
def delete_comment(comment_id: str):
    return {'comment': comment_id}
