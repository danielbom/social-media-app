from fastapi import APIRouter

from app import dto

router = APIRouter(prefix='/users', tags=['Users'])


@router.post('/')
def create_user(user: dto.CreateUser):
    return {
        'username': user.username,
        'password': user.password,
        'role': user.role,
    }


@router.get('/')
def get_users():
    return {'users': 'users'}


@router.get('/{user_id}')
def get_user(user_id: str):
    return {'user': user_id}


@router.patch('/{user_id}')
def update_user(user_id: str, updates: dto.UpdateUser):
    return {'user': user_id, 'body': updates}


@router.delete('/{user_id}')
def delete_user(user_id: str):
    return {'user': user_id}
