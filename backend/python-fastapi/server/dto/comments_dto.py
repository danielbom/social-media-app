from typing import Optional

from pydantic import BaseModel

from server.dto._commons import format_date
from server.dto._page_dto import PageResponse
from server.models import CommentModel


class CommentResponse(BaseModel):
    id: str
    content: str
    likes: int
    authorId: str
    postParentId: str
    commentParentId: Optional[str]
    createdAt: str
    updatedAt: str
    deletedAt: Optional[str]

    @staticmethod
    def from_model(comment: CommentModel) -> 'CommentResponse':
        return CommentResponse(
            id=comment.id,
            content=comment.content,
            likes=comment.likes,
            authorId=comment.author_id,
            postParentId=comment.post_parent_id,
            commentParentId=comment.comment_parent_id,
            createdAt=format_date(comment.created_at),
            updatedAt=format_date(comment.updated_at),
            deletedAt=format_date(comment.deleted_at),
        )


CommentsPageResponse = PageResponse[CommentResponse]


class CreateCommentBody(BaseModel):
    content: str
    postId: str


class CreateCommentAnswerBody(BaseModel):
    content: str
    commentId: str


class UpdateCommentBody(BaseModel):
    content: str
