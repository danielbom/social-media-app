from fastapi import APIRouter

from app import dto

router = APIRouter(prefix='/auth', tags=['Auth'])


@router.post('/login')
def login(user: dto.AuthLogin):
    return {'username': user.username, 'password': user.password}


@router.post('/register')
def register(user: dto.AuthRegister):
    return {'username': user.username, 'password': user.password}


@router.get('/me')
def me():
    return {'username': 'username', 'password': 'password'}
