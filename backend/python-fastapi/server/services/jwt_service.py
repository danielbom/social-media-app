from datetime import datetime, timedelta
from typing import Callable, List, Optional

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel

from server.env import env
from server.errors import Errors, ForbiddenError, UnauthorizedError
from server.models import UserModel, UserRole
from server.repositories.user_repository import (UserRepository,
                                                 get_user_repository)

JWT_ALGORITHM = 'HS256'
JWT_SECRET_KEY = env.jwt_secret
JWT_EXPIRES_IN = env.jwt_expires_in
JWT_REFRESH_EXPIRES_IN = env.jwt_refresh_expires_in

oauth2_schema = OAuth2PasswordBearer(
    tokenUrl='/auth/oauth-login',
    auto_error=False)


class TokenData(BaseModel):
    user_id: str
    type: str
    user: UserModel
    value: str


class JwtService:
    def __init__(self, user_repository: UserRepository) -> None:
        self.user_repository = user_repository

    def _create_token(self, data: dict, milliseconds: int, typ: str) -> str:
        data['exp'] = datetime.now() + timedelta(milliseconds=milliseconds)
        data['typ'] = typ
        token = jwt.encode(data, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        return token

    def create_access_token(self, data: dict) -> str:
        return self._create_token(data,
                                  JWT_EXPIRES_IN,
                                  'access_token')

    def create_refresh_token(self, data: dict) -> str:
        return self._create_token(data,
                                  JWT_REFRESH_EXPIRES_IN,
                                  'refresh_token')

    async def decode_token(self, token: str) -> TokenData:
        try:
            data = jwt.decode(token, JWT_SECRET_KEY, algorithms=JWT_ALGORITHM)
            user_id = data['sub']
            user = await self.user_repository.get_by_id(user_id)
            if user is None:
                raise UnauthorizedError(Errors.INVALID_TOKEN)
            if user.version != data.get('version'):
                raise UnauthorizedError(Errors.TOKEN_VERSION_MISMATCH)
            return TokenData(user_id=user_id, user=user,
                             type=data.get('typ', 'access_token'),
                             value=token)
        except JWTError as e:
            raise UnauthorizedError(str(e))


def get_jwt_service(
    user_repository: UserRepository = Depends(get_user_repository)
) -> JwtService:
    return JwtService(user_repository)


def _token_guard(*, required=False):
    async def guard(
        jwt_service: JwtService = Depends(get_jwt_service),
        token: Optional[str] = Depends(oauth2_schema),
    ) -> Optional[TokenData]:
        if not token:
            if required:
                raise UnauthorizedError(Errors.MISSING_AUTHORIZATION)
            return None
        return await jwt_service.decode_token(token)
    return guard


def auth_guard(roles: List[UserRole] = [], *, required=False):
    if len(roles) == 0:
        return _token_guard(required=required)

    def guard(
        token: Optional[TokenData] = Depends(_token_guard(required=required))
    ) -> Optional[TokenData]:
        if token is not None and token.user.role not in roles:
            raise ForbiddenError(Errors.MISSING_ROLE)
        return token

    return guard
