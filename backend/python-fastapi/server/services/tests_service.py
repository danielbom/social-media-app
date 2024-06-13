
from fastapi import Depends

from server.errors import Errors, UnauthorizedError
from server.models import UserModel, UserRole
from server.repositories.comments_repository import (CommentsRepository,
                                                     get_comments_repository)
from server.repositories.posts_repository import (PostsRepository,
                                                  get_posts_repository)
from server.repositories.user_repository import (UserRepository,
                                                 get_user_repository)
from server.services.crypt_service import CryptService, get_crypt_service


class TestsService:
    def __init__(self,
                 comments_repository: CommentsRepository,
                 user_repository: UserRepository,
                 post_repository: PostsRepository,
                 crypt_service: CryptService) -> None:
        self.comments_repository = comments_repository
        self.user_repository = user_repository
        self.post_repository = post_repository
        self.crypt_service = crypt_service

    async def tear_up(self) -> None:
        tester = await self.user_repository.find_by_username("tester")
        if tester is not None:
            return

        await self.user_repository.create(
            username="tester",
            password=self.crypt_service.hash_password("test1234"),
            role=UserRole.USER)

    async def tear_down(self, user: UserModel) -> None:
        if user.username != "tester":
            raise UnauthorizedError(Errors.FORBIDDEN_ACTION)

        await self.comments_repository.delete_all(authorId=user.id)
        await self.post_repository.delete_all(author_id=user.id)
        await self.user_repository.delete(user.id)


def get_tests_service(
    comments_repository: CommentsRepository = Depends(get_comments_repository),
    user_repository: UserRepository = Depends(get_user_repository),
    post_repository: PostsRepository = Depends(get_posts_repository),
    crypt_service: CryptService = Depends(get_crypt_service)
) -> TestsService:
    return TestsService(comments_repository, user_repository,
                        post_repository, crypt_service)
