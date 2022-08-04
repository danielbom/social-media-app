from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from app import env, schemas

JWT_ALGORITHM = 'HS256'
JWT_SECRET_KEY = env.jwt_secret
JWT_EXPIRES_IN = env.jwt_expires_in

oauth2_schema = OAuth2PasswordBearer(tokenUrl='login')


def create_token(data: dict):
    data['exp'] = datetime.now() + timedelta(milliseconds=JWT_EXPIRES_IN)
    token = jwt.encode(data, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return token


def decode_token(token: str = Depends(oauth2_schema)):

    try:
        data = jwt.decode(token, JWT_SECRET_KEY, algorithms=JWT_ALGORITHM)
        return schemas.TokenData(user_id=data['sub'], role=data['role'])
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e)
        )
