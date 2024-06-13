from fastapi import Depends

from server.dto.posts_dto import (PostResponse, PostsPageResponse,
                                  PostStoreBody, PostUpdateBody)
from server.errors import DomainError, Errors
from server.models import UserModel
from server.repositories.posts_repository import (PostsRepository,
                                                  get_posts_repository)


class PostsService:
    def __init__(self, posts_repository: PostsRepository):
        self.posts_repository = posts_repository

    async def create(self, user: UserModel,
                     body: PostStoreBody) -> PostResponse:
        post = await self.posts_repository.create(
            content=body.content,
            author_id=user.id,
        )
        return PostResponse.from_model(post)

    async def find_all(self, page: int, page_size: int) -> PostsPageResponse:
        posts = await self.posts_repository.find_all(page, page_size)
        items = [PostResponse.from_model(it) for it in posts]
        posts_count = await self.posts_repository.find_all_count()
        return PostsPageResponse.make(items, posts_count, page, page_size)

    async def find_one(self, id: str) -> PostResponse:
        post = await self.posts_repository.find_by_id(id)
        if not post:
            raise DomainError(Errors.POST_DOES_NOT_EXIST)
        return PostResponse.from_model(post)

    async def update_content(self, user: UserModel, id: str,
                             body: PostUpdateBody) -> PostResponse:
        post = await self.posts_repository.find_by_id(id)
        if not post:
            raise DomainError(Errors.POST_DOES_NOT_EXIST)
        if post.author_id != user.id:
            raise DomainError(Errors.IS_NOT_POST_AUTHOR)
        post.content = body.content
        await self.posts_repository.update_content(id, post.content)
        return PostResponse.from_model(post)

    async def give_like(self, user: UserModel, id: str) -> PostResponse:
        post = await self.posts_repository.find_by_id(id)
        if not post:
            raise DomainError(Errors.POST_DOES_NOT_EXIST)
        post.likes += 1
        await self.posts_repository.update_likes(id, post.likes)
        return PostResponse.from_model(post)

    async def remove_like(self, user: UserModel, id: str) -> PostResponse:
        post = await self.posts_repository.find_by_id(id)
        if not post:
            raise DomainError(Errors.POST_DOES_NOT_EXIST)
        post.likes -= 1
        await self.posts_repository.update_likes(id, post.likes)
        return PostResponse.from_model(post)

    async def remove(self, user: UserModel, id: str) -> None:
        post = await self.posts_repository.find_by_id(id)
        if not post:
            raise DomainError(Errors.POST_DOES_NOT_EXIST)
        if post.author_id != user.id:
            raise DomainError(Errors.IS_NOT_POST_AUTHOR)
        await self.posts_repository.delete_soft(id)


def get_posts_service(
    posts_repository: PostsRepository = Depends(get_posts_repository),
) -> PostsService:
    return PostsService(posts_repository)
