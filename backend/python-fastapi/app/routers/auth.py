from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app import models, schemas
from app.database import Session, get_db
from app.services import crypt, jwt

from . import users

router = APIRouter(prefix='/auth', tags=['Auth'])


@router.post('/login')
def login(body: schemas.AuthLogin, db: Session = Depends(get_db)):
    user = (
        db.query(models.User)
        .filter(models.User.username == body.username)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='User not found'
        )

    if not crypt.check_password(body.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid credentials',
        )

    token = jwt.create_token({'sub': user.id, 'role': user.role})
    return {'token': token}


@router.post('/login2')
def login2(
    body: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    return login(
        schemas.AuthLogin(username=body.username, password=body.password), db
    )


@router.post(
    '/register',
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.User,
)
def register(user: schemas.AuthRegister, db: Session = Depends(get_db)):
    return users.create_user(
        schemas.CreateUser(
            username=user.username,
            password=user.password,
            role='user',
        ),
        db,
    )


@router.get('/me', response_model=schemas.User)
def me(db: Session = Depends(get_db), token_data=Depends(jwt.decode_token)):
    return users.get_user(token_data.user_id, db)
