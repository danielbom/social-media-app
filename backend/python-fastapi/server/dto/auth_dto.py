
from pydantic import BaseModel


class AuthLoginBody(BaseModel):
    username: str
    password: str


class AuthRegisterBody(BaseModel):
    username: str
    password: str


class AuthResponse(BaseModel):
    # https://fastapi.tiangolo.com/tutorial/security/simple-oauth2/
    # Required
    refresh_token: str
    access_token: str
    token_type: str = 'bearer'
