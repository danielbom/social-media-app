import uuid
from datetime import datetime
from typing import List, Optional

from databases.core import Connection
from fastapi import Depends

from server.database import get_database
from server.models import CommentModel


class CommentsRepository:
    def __init__(self, db: Connection) -> None:
        self.db = db

    async def find_all(self) -> List[CommentModel]:
        query = """
        SELECT *
        FROM comment as c
        WHERE c.deleted_at IS NULL
        """
        records = await self.db.fetch_all(query)
        return [CommentModel(**dict(it)) for it in records]

    async def find_by_id(self, id: str) -> Optional[CommentModel]:
        query = """
        SELECT *
        FROM comment as c
        WHERE id = :id
          AND c.deleted_at IS NULL
        """
        record = await self.db.fetch_one(query, values={"id": id})
        return CommentModel(**dict(record)) if record else None

    async def create(
        self, *,
        content: str,
        author_id: str,
        post_parent_id: str,
        comment_parent_id: Optional[str],
    ) -> CommentModel:
        query = """
        INSERT INTO comment (id, content, likes, author_id, post_parent_id, comment_parent_id, created_at, updated_at, deleted_at)
        VALUES (:id, :content, :likes, :author_id, :post_parent_id, :comment_parent_id, :created_at, :updated_at, :deleted_at)
        """
        now = datetime.now()
        model = CommentModel(
            id=str(uuid.uuid4()),
            content=content,
            likes=0,
            author_id=author_id,
            post_parent_id=post_parent_id,
            comment_parent_id=comment_parent_id,
            created_at=now,
            updated_at=now,
            deleted_at=None,
        )
        await self.db.execute(query, values=model.model_dump())
        return model

    async def update(self, id: str, content: str) -> None:
        query = """
        UPDATE comment
        SET content = :content, updated_at = :updated_at
        WHERE id = :id
        """
        now = datetime.now()
        await self.db.execute(query, values={"id": id, "content": content, "updated_at": now})

    async def delete_soft(self, id: str) -> None:
        query = """
        UPDATE comment
        SET deleted_at = :deleted_at
        WHERE id = :id
        """
        now = datetime.now()
        await self.db.execute(query, values={"id": id, "deleted_at": now})

    async def delete(self, id: str) -> None:
        query = "DELETE FROM comment WHERE id = :id"
        await self.db.execute(query, values={"id": id})

    async def delete_all(self, authorId: str) -> None:
        query = "DELETE FROM comment WHERE author_id = :authorId and comment_parent_id IS NOT NULL"
        await self.db.execute(query, values={"authorId": authorId})
        query = "DELETE FROM comment WHERE author_id = :authorId"
        await self.db.execute(query, values={"authorId": authorId})


def get_comments_repository(
    db: Connection = Depends(get_database),
) -> CommentsRepository:
    return CommentsRepository(db)
