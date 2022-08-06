from datetime import datetime

from pydantic import BaseModel, Extra

# https://stackoverflow.com/questions/67995510/how-to-inflect-from-snake-case-to-camel-case-post-the-pydantic-schema-validation
# TODO: Transform snake_case to camelCase?

# https://pydantic-docs.helpmanual.io/usage/validators/
# TODO: Add validators

# Auth


class AuthLogin(BaseModel, extra=Extra.forbid):
    username: str
    password: str


class AuthRegister(BaseModel, extra=Extra.forbid):
    username: str
    password: str


# Comments


class CreateCommentAnswer(BaseModel, extra=Extra.forbid):
    content: str
    comment_id: str


class CreateComment(BaseModel, extra=Extra.forbid):
    content: str
    post_id: str


class UpdateComment(BaseModel, extra=Extra.forbid):
    content: str


# Posts


class CreatePost(BaseModel, extra=Extra.forbid):
    content: str


class UpdatePost(BaseModel, extra=Extra.forbid):
    content: str


# Users


class User(BaseModel):
    id: str
    username: str
    role: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
        extra = Extra.forbid


class TokenData(BaseModel):
    user_id: str
    role: str


class CreateUser(BaseModel, extra=Extra.forbid):
    username: str
    password: str
    role: str


class UpdateUser(BaseModel, extra=Extra.forbid):
    username: str
    password: str
    role: str
