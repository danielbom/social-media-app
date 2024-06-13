from fastapi import APIRouter, Depends, status

from server.dto.users_dto import (UserCreateBody, UserResponse,
                                  UsersPageResponse, UserUpdateBody)
from server.models import UserRole
from server.services.jwt_service import TokenData, auth_guard
from server.services.users_service import UsersService, get_users_service

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.post("/",
             status_code=status.HTTP_201_CREATED)
async def users_store(
    body: UserCreateBody,
    users_service: UsersService = Depends(get_users_service),
    _: TokenData = Depends(auth_guard([UserRole.ADMIN]))
) -> UserResponse:
    return await users_service.create(body)


@router.get("/")
async def users_index(
    page: int = 1,
    pageSize: int = 20,
    users_service: UsersService = Depends(get_users_service),
    _: TokenData = Depends(auth_guard())
) -> UsersPageResponse:
    return await users_service.find_all(page, pageSize)


@router.get("/{user_id}")
async def users_show(
    user_id: str,
    users_service: UsersService = Depends(get_users_service),
    _: TokenData = Depends(auth_guard())
) -> UserResponse:
    return await users_service.find_one(user_id)


@router.patch("/{user_id}")
async def users_update(
    user_id: str,
    body: UserUpdateBody,
    user_service: UsersService = Depends(get_users_service),
    token: TokenData = Depends(auth_guard(required=True))
) -> UserResponse:
    return await user_service.update(user_id, body)


@router.delete("/{user_id}",
               status_code=status.HTTP_204_NO_CONTENT)
async def users_delete(
    user_id: str,
    users_service: UsersService = Depends(get_users_service),
    _: TokenData = Depends(auth_guard([UserRole.ADMIN]))
) -> None:
    return await users_service.delete(user_id)
