from typing import Optional

from pydantic import BaseModel

from server.dto._commons import format_date
from server.dto._page_dto import PageResponse
from server.models import PostModel


class PostResponse(BaseModel):
    id: str
    content: str
    likes: int
    authorId: str
    createdAt: str
    updatedAt: str
    deletedAt: Optional[str]

    @staticmethod
    def from_model(post: PostModel) -> "PostResponse":
        return PostResponse(
            id=post.id,
            content=post.content,
            likes=0,
            authorId=post.author_id,
            createdAt=format_date(post.created_at),
            updatedAt=format_date(post.updated_at),
            deletedAt=format_date(post.deleted_at),
        )


PostsPageResponse = PageResponse[PostResponse]


class PostStoreBody(BaseModel):
    content: str


class PostUpdateBody(BaseModel):
    content: str
