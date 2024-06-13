from typing import Optional

from pydantic import BaseModel

from server.dto._page_dto import PageResponse
from server.models import UserModel, UserRole


class UserResponse(BaseModel):
    id: str
    username: str
    role: UserRole
    version: int = 0

    @staticmethod
    def from_model(user: UserModel) -> 'UserResponse':
        return UserResponse(
            id=user.id,
            username=user.username,
            role=user.role,
            version=user.version,
        )


UsersPageResponse = PageResponse[UserResponse]


class UserCreateBody(BaseModel):
    username: str
    password: str
    role: UserRole


class UserUpdateBody(BaseModel):
    username: Optional[str]
    password: Optional[str]
    role: Optional[UserRole]
