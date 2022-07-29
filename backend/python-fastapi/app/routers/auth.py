from fastapi import APIRouter

from app import models

router = APIRouter(prefix='/auth', tags=['Auth'])


@router.post('/login')
def login(user: models.AuthLogin):
    return {'username': user.username, 'password': user.password}


@router.post('/register')
def register(user: models.AuthRegister):
    return {'username': user.username, 'password': user.password}


@router.get('/me')
def me():
    return {'username': 'username', 'password': 'password'}
