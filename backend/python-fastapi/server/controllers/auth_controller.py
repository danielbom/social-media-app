from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm

from server.dto.auth_dto import AuthLoginBody, AuthRegisterBody, AuthResponse
from server.dto.users_dto import UserResponse
from server.services.auth_service import AuthService, get_auth_service
from server.services.jwt_service import TokenData, auth_guard

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.post("/login",
             description='Validate the user credentials to provide a authentication access to other resources')
async def auth_login(
    body: AuthLoginBody,
    auth_service: AuthService = Depends(get_auth_service)
) -> AuthResponse:
    return await auth_service.login(body)


@router.post("/oauth-login",
             description='Validate the user credentials to provide a authentication access to other resources')
async def auth_oauth_login(
    form: OAuth2PasswordRequestForm = Depends(),
    auth_service: AuthService = Depends(get_auth_service)
) -> AuthResponse:
    body = AuthLoginBody(username=form.username, password=form.password)
    return await auth_login(body, auth_service)


@router.post("/register",
             description='Register a new user',
             status_code=status.HTTP_201_CREATED)
async def auth_register(
    body: AuthRegisterBody,
    auth_service: AuthService = Depends(get_auth_service)
) -> AuthResponse:
    return await auth_service.register(body)


@router.get("/me",
            description='Get the current user')
async def auth_me(
    token: TokenData = Depends(auth_guard(required=True))
) -> UserResponse:
    return UserResponse.from_model(token.user)
