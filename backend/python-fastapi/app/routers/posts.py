from fastapi import APIRouter

from app import models

router = APIRouter(prefix='/posts', tags=['Posts'])


@router.post('/')
def create_post(post: models.CreatePost):
    return {'content': post.content}


@router.get('/')
def get_posts():
    return {'posts': 'posts'}


@router.get('/{post_id}')
def get_post(post_id: str):
    return {'post': post_id}


@router.patch('/{post_id}')
def update_post(post_id: str, updates: models.UpdatePost):
    return {'post': post_id, 'body': updates}


@router.delete('/{post_id}')
def delete_post(post_id: str):
    return {'post': post_id}