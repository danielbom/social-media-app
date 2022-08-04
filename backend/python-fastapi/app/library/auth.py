from typing import List

from fastapi import HTTPException, status

from app import schemas


def ensure_role(token_data: schemas.TokenData, roles: List[str]):
    if token_data.role not in roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail='Not authorized'
        )


def ensure_user_data(token_data: schemas.TokenData, user_id: str):
    if token_data.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail='Not authorized'
        )
