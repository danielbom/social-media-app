from fastapi import Depends

from server.dto.users_dto import (UserCreateBody, UserResponse,
                                  UsersPageResponse, UserUpdateBody)
from server.errors import DomainError, Errors, UnauthorizedError
from server.repositories.user_repository import (UserRepository,
                                                 get_user_repository)
from server.services.crypt_service import CryptService, get_crypt_service


class UsersService:
    def __init__(self, crypt_service: CryptService,
                 user_repository: UserRepository) -> None:
        self.crypt_service = crypt_service
        self.user_repository = user_repository

    async def get_authenticated(self, username: str,
                                password: str) -> UserResponse:
        user = await self.user_repository.find_by_username(username)
        if not user:
            raise DomainError(Errors.INVALID_CREDENTIALS)
        if not self.crypt_service.check_password(password, user.password):
            raise UnauthorizedError(Errors.INVALID_CREDENTIALS)
        return UserResponse.from_model(user)

    async def find_all(self, page: int, pageSize: int) -> UsersPageResponse:
        users = await self.user_repository.find_all(page, pageSize)
        items = [UserResponse.from_model(user) for user in users]
        count = len(items)
        return UsersPageResponse.make(items, count, page, pageSize)

    async def find_one(self, user_id: str) -> UserResponse:
        user = await self.user_repository.get_by_id(user_id)
        if not user:
            raise DomainError(Errors.USER_DOES_NOT_EXIST)
        return UserResponse.from_model(user)

    async def create(self, body: UserCreateBody) -> UserResponse:
        user = await self.user_repository.find_by_username(body.username)
        if user:
            raise DomainError(Errors.USER_ALREADY_EXISTS)
        user = await self.user_repository.create(
            username=body.username,
            password=self.crypt_service.hash_password(body.password),
            role=body.role
        )
        return UserResponse.from_model(user)

    async def update(self, user_id: str, body: UserUpdateBody) -> UserResponse:
        user = await self.user_repository.get_by_id(user_id)
        if not user:
            raise DomainError(Errors.USER_DOES_NOT_EXIST)
        data = body.model_dump(exclude_unset=True)
        if 'password' in data:
            user.password = self.crypt_service.hash_password(data['password'])
        if 'username' in data:
            user.username = data['username']
        if 'role' in data:
            user.role = data['role']
        await self.user_repository.update(
            user_id,
            username=user.username,
            password=user.password,
            role=user.role)
        return UserResponse.from_model(user)

    async def delete(self, user_id: str) -> None:
        user = await self.user_repository.get_by_id(user_id)
        if not user:
            raise DomainError(Errors.USER_DOES_NOT_EXIST)
        await self.user_repository.delete(user_id)


def get_users_service(
    crypt_service: CryptService = Depends(get_crypt_service),
    user_repository: UserRepository = Depends(get_user_repository)
) -> UsersService:
    return UsersService(crypt_service, user_repository)
