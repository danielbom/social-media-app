import json
from enum import Enum
from typing import cast

from fastapi import FastAPI, Request, Response


class Errors(str, Enum):
    INVALID_CREDENTIALS = 'User and/or password was invalid.'

    USER_ALREADY_EXISTS = 'User already exists.'
    USER_DOES_NOT_EXIST = 'User does not exist.'
    POST_DOES_NOT_EXIST = 'Post does not exist.'
    COMMENT_DOES_NOT_EXIST = 'Comment does not exist.'
    IS_NOT_POST_AUTHOR = 'You are not the author of this post.'
    IS_NOT_COMMENT_AUTHOR = 'You are not the author of this comment.'

    MISSING_AUTHORIZATION = 'Missing authorization.'
    MISSING_ROLE = 'Missing role.'
    INVALID_TOKEN = 'Invalid token.'
    TOKEN_VERSION_MISMATCH = 'Token version mismatch.'
    UNAUTHOTIZED = 'Unauthorized.'

    FORBIDDEN_ACTION = 'You are not authorized to perform this action.'


class DomainError(Exception):
    status_code = 400


class UnauthorizedError(DomainError):
    status_code = 401


class ForbiddenError(DomainError):
    status_code = 403


def domain_error_handler(_request: Request, exception: Exception) -> Response:
    error = cast(DomainError, exception)
    content = {
        "message": error.args[0].value,
        "error": str(error.args[0]).replace("Errors.", "")
    }
    return Response(status_code=error.status_code,
                    content=json.dumps(content),
                    media_type="application/json")


def configure(app: FastAPI) -> None:
    app.add_exception_handler(DomainError, domain_error_handler)
