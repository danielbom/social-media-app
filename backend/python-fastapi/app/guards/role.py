from typing import Callable, List

from fastapi import Depends

from app import schemas
from app.library.auth import ensure_role
from app.services import jwt

# https://stackoverflow.com/questions/64497615/how-to-add-a-custom-decorator-to-a-fastapi-route


def role_guard(roles: List[str]) -> Callable[[schemas.TokenData], schemas.TokenData]:
    def guard(token_data: schemas.TokenData = Depends(jwt.decode_token)) -> schemas.TokenData:
        ensure_role(token_data, roles)
        return token_data

    return guard
