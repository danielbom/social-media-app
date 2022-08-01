from fastapi import APIRouter

from app import schemas

router = APIRouter(prefix='/auth', tags=['Auth'])


@router.post('/login')
def login(user: schemas.AuthLogin):
    return {'username': user.username, 'password': user.password}


@router.post('/register')
def register(user: schemas.AuthRegister):
    return {'username': user.username, 'password': user.password}


@router.get('/me')
def me():
    return {'username': 'username', 'password': 'password'}
