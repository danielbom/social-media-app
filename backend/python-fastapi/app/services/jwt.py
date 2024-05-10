from datetime import datetime, timedelta
from typing import cast

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from app import env, schemas

JWT_ALGORITHM = 'HS256'
JWT_SECRET_KEY = env.jwt_secret
JWT_EXPIRES_IN = env.jwt_expires_in

oauth2_schema = OAuth2PasswordBearer(tokenUrl='/auth/login2')


def create_token(data: dict[str, str]) -> str:
    data['exp'] = str((datetime.now() + timedelta(milliseconds=JWT_EXPIRES_IN)).timestamp())
    token = jwt.encode(data, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return cast(str, token)


def decode_token(token: str = Depends(oauth2_schema)) -> schemas.TokenData:
    try:
        data = jwt.decode(token, JWT_SECRET_KEY, algorithms=JWT_ALGORITHM)
        return schemas.TokenData(user_id=data['sub'], role=data['role'])
    except JWTError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
