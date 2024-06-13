from fastapi import Depends

from server.dto.auth_dto import AuthLoginBody, AuthRegisterBody, AuthResponse
from server.dto.users_dto import UserCreateBody
from server.models import UserRole
from server.services.jwt_service import JwtService, TokenData, get_jwt_service
from server.services.users_service import UsersService, get_users_service


class AuthService:
    def __init__(self, user_service: UsersService,
                 jwt_service: JwtService) -> None:
        self.user_service = user_service
        self.jwt_service = jwt_service

    async def login(self, body: AuthLoginBody) -> AuthResponse:
        user = await self.user_service.get_authenticated(
            username=body.username,
            password=body.password
        )
        return self._create_auth_response(user.id, user.version)

    async def auth_refresh(self, refresh_token: TokenData) -> AuthResponse:
        user = refresh_token.user
        data = {'sub': str(user.id), 'version': user.version}
        access_token = self.jwt_service.create_access_token(data)
        return AuthResponse(access_token=access_token,
                            refresh_token=refresh_token.value)

    async def register(self, body: AuthRegisterBody) -> AuthResponse:
        user = await self.user_service.create(UserCreateBody(
            username=body.username,
            password=body.password,
            role=UserRole.USER
        ))
        return self._create_auth_response(user.id, user.version)

    def _create_auth_response(self,
                              user_id: str,
                              version: int) -> AuthResponse:
        data = {'sub': user_id, 'version': version}
        access_token = self.jwt_service.create_access_token(data)
        refresh_token = self.jwt_service.create_refresh_token(data)
        return AuthResponse(access_token=access_token,
                            refresh_token=refresh_token)


def get_auth_service(
    user_service: UsersService = Depends(get_users_service),
    jwt_service: JwtService = Depends(get_jwt_service),
) -> AuthService:
    return AuthService(user_service, jwt_service)
