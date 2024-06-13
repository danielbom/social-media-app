from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel


class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"


class UserModel(BaseModel):
    id: str
    username: str
    password: str
    role: UserRole
    version: int


class PostModel(BaseModel):
    id: str
    content: str
    likes: int
    author_id: str
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]


class CommentModel(BaseModel):
    id: str
    content: str
    likes: int
    author_id: str
    post_parent_id: str
    comment_parent_id: Optional[str]
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]
