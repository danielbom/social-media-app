from fastapi import Depends

from server.dto.comments_dto import (CommentResponse, CommentsPageResponse,
                                     CreateCommentAnswerBody,
                                     CreateCommentBody, UpdateCommentBody)
from server.errors import DomainError, Errors
from server.models import UserModel
from server.repositories.comments_repository import (CommentsRepository,
                                                     get_comments_repository)
from server.repositories.posts_repository import (PostsRepository,
                                                  get_posts_repository)


class CommentsService:
    def __init__(self,
                 comments_repository: CommentsRepository,
                 posts_repository: PostsRepository):
        self.comments_repository = comments_repository
        self.posts_repository = posts_repository

    async def create(self, author: UserModel,
                     body: CreateCommentBody) -> CommentResponse:
        post_parent = await self.posts_repository.find_by_id(body.postId)
        if not post_parent:
            raise DomainError(Errors.POST_DOES_NOT_EXIST)
        comment = await self.comments_repository.create(
            content=body.content,
            author_id=author.id,
            post_parent_id=body.postId,
            comment_parent_id=None,
        )
        return CommentResponse.from_model(comment)

    async def create_answer(self, author: UserModel,
                            body: CreateCommentAnswerBody) -> CommentResponse:
        comment_parent = await self.comments_repository.find_by_id(body.commentId)
        if not comment_parent:
            raise DomainError(Errors.COMMENT_DOES_NOT_EXIST)
        comment = await self.comments_repository.create(
            content=body.content,
            author_id=author.id,
            post_parent_id=comment_parent.post_parent_id,
            comment_parent_id=comment_parent.id,
        )
        return CommentResponse.from_model(comment)

    async def find_all(self, author: UserModel, page: int,
                       pageSize: int) -> CommentsPageResponse:
        items = await self.comments_repository.find_all()
        count = len(items)
        return CommentsPageResponse.make(
            [CommentResponse.from_model(item) for item in items],
            count,
            page,
            pageSize
        )

    async def find_one(self, user: UserModel, id: str) -> CommentResponse:
        comment = await self.comments_repository.find_by_id(id)
        if not comment:
            raise DomainError(Errors.COMMENT_DOES_NOT_EXIST)
        if comment.author_id != user.id:
            raise DomainError(Errors.IS_NOT_COMMENT_AUTHOR)
        return CommentResponse.from_model(comment)

    async def update_content(self, user: UserModel, id: str,
                             body: UpdateCommentBody) -> CommentResponse:
        comment = await self.comments_repository.find_by_id(id)
        if not comment:
            raise DomainError(Errors.COMMENT_DOES_NOT_EXIST)
        if comment.author_id != user.id:
            raise DomainError(Errors.IS_NOT_COMMENT_AUTHOR)
        comment.content = body.content
        await self.comments_repository.update(id, comment.content)
        return CommentResponse.from_model(comment)

    async def delete(self, user: UserModel, id: str) -> None:
        comment = await self.comments_repository.find_by_id(id)
        if not comment:
            raise DomainError(Errors.COMMENT_DOES_NOT_EXIST)
        if comment.author_id != user.id:
            raise DomainError(Errors.IS_NOT_COMMENT_AUTHOR)
        await self.comments_repository.delete_soft(id)


def get_comments_service(
    comments_repository: CommentsRepository = Depends(get_comments_repository),
    posts_repository: PostsRepository = Depends(get_posts_repository),
) -> CommentsService:
    return CommentsService(comments_repository, posts_repository)
