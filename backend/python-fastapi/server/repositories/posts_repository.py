import uuid
from datetime import datetime
from typing import List, Optional

from databases.core import Connection
from fastapi import Depends

from server.database import get_database
from server.models import PostModel


class PostsRepository:
    def __init__(self, db: Connection) -> None:
        self.db = db

    async def create(self, content: str, author_id: str) -> PostModel:
        query = """
        INSERT INTO post (id, content, likes, author_id, created_at, updated_at, deleted_at)
        VALUES (:id, :content, :likes, :author_id, :created_at, :updated_at, :deleted_at)
        """
        now = datetime.now()
        model = PostModel(
            id=str(uuid.uuid4()),
            content=content,
            likes=0,
            author_id=author_id,
            created_at=now,
            updated_at=now,
            deleted_at=None,
        )
        await self.db.execute(query, values=model.model_dump())
        return model

    async def find_all(self, page: int, page_size: int) -> List[PostModel]:
        query = """
        SELECT *
        FROM post as p
        LIMIT :page_size
        OFFSET :offset
        """
        records = await self.db.fetch_all(query, {
            "page_size": page_size,
            "offset": page_size * (page - 1)
        })
        return [PostModel(**dict(it)) for it in records]

    async def find_all_count(self) -> int:
        query = """
        SELECT *
        FROM post as p
        """
        count_query = f"""
        SELECT COUNT(*) as count
        FROM ({query}) as q
        """
        return await self.db.fetch_val(count_query)

    async def find_by_id(self, id: str) -> Optional[PostModel]:
        query = """
        SELECT *
        FROM post as p
        WHERE p.id = :id
         AND p.deleted_at IS NULL
        """
        record = await self.db.fetch_one(query, values={"id": id})
        if not record:
            return None
        return PostModel(**dict(record))

    async def update_content(self, id: str, content: str) -> None:
        query = """
        UPDATE post
        SET content = :content
        WHERE id = :id
        """
        await self.db.execute(query, values={
            "content": content,
            "id": id,
        })

    async def update_likes(self, id: str, likes: int) -> None:
        query = """
        UPDATE post
        SET likes = :likes
        WHERE id = :id
        """
        await self.db.execute(query, values={
            "likes": likes,
            "id": id,
        })

    async def delete_soft(self, id: str) -> None:
        query = """
        UPDATE post
        SET deleted_at = :deleted_at
        WHERE id = :id
        """
        await self.db.execute(query, values={
            "deleted_at": datetime.now(),
            "id": id,
        })

    async def delete(self, id: str) -> None:
        query = "DELETE FROM post WHERE id = :id"
        await self.db.execute(query, values={"id": id})

    async def delete_all(self, author_id: str) -> None:
        query = """
        DELETE FROM post WHERE author_id = :author_id
        """
        await self.db.execute(query, values={"author_id": author_id})


def get_posts_repository(
    db: Connection = Depends(get_database),
) -> PostsRepository:
    return PostsRepository(db)
