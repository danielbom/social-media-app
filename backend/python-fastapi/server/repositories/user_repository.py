import uuid
from datetime import datetime
from typing import List

from databases.core import Connection
from fastapi import Depends

from server.database import get_database
from server.models import UserModel, UserRole


class UserRepository:
    def __init__(self, db: Connection) -> None:
        self.db = db

    async def find_all(self, page: int, page_size: int) -> List[UserModel]:
        query = """
        SELECT *
        FROM user
        LIMIT :pageSize
        OFFSET :offset
        """
        records = await self.db.fetch_all(query, {
            "pageSize": page_size,
            "offset": page_size * (page - 1)
        })
        return [UserModel(**dict(it)) for it in records]

    async def create(self, *, username: str, password: str,
                     role: UserRole) -> UserModel:
        query = """
        INSERT INTO user (id, username, password, role, version)
        VALUES (:id, :username, :password, :role, :version)
        """
        now = datetime.now()
        model = UserModel(
            id=str(uuid.uuid4()),
            username=username,
            password=password,
            role=role,
            version=0,
        )
        await self.db.execute(query, values=model.model_dump())
        return model

    async def update(self, user_id: str, *, username: str,
                     password: str, role: UserRole) -> None:
        query = """
        UPDATE user
        SET username = :username,
            password = :password,
            role = :role
        WHERE id = :id
        """
        await self.db.execute(query, {
            "id": user_id,
            "username": username,
            "password": password,
            "role": role.value,
        })

    async def find_by_username(self, username: str) -> UserModel | None:
        query = "SELECT * FROM user WHERE username = :username"
        record = await self.db.fetch_one(query, {"username": username})
        if record is None:
            return None
        return UserModel(**dict(record))

    async def get_by_id(self, user_id: str) -> UserModel | None:
        query = "SELECT * FROM user WHERE id = :user_id"
        record = await self.db.fetch_one(query, {"user_id": user_id})
        if record is None:
            return None
        return UserModel(**dict(record))

    async def delete(self, user_id: str) -> None:
        query = "DELETE FROM user WHERE id = :user_id"
        await self.db.execute(query, {"user_id": user_id})


def get_user_repository(
    db: Connection = Depends(get_database)
) -> UserRepository:
    return UserRepository(db)
