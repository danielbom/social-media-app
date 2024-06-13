from fastapi import APIRouter, Depends, status

from server.dto.posts_dto import (PostResponse, PostsPageResponse,
                                  PostStoreBody, PostUpdateBody)
from server.services.jwt_service import TokenData, auth_guard
from server.services.posts_service import PostsService, get_posts_service

router = APIRouter(
    prefix="/posts",
    tags=["Posts"],
)


@router.post("/",
             status_code=status.HTTP_201_CREATED)
async def posts_store(
    body: PostStoreBody,
    token: TokenData = Depends(auth_guard(required=True)),
    posts_service: PostsService = Depends(get_posts_service)
) -> PostResponse:
    return await posts_service.create(token.user, body)


@router.get("/")
async def posts_index(
    page: int = 1,
    pageSize: int = 20,
    posts_service: PostsService = Depends(get_posts_service)
) -> PostsPageResponse:
    return await posts_service.find_all(page, pageSize)


@router.get("/{post_id}")
async def posts_show(
    post_id: str,
    posts_service: PostsService = Depends(get_posts_service)
) -> PostResponse:
    return await posts_service.find_one(post_id)


@router.patch("/{post_id}")
async def posts_update(
    post_id: str,
    body: PostUpdateBody,
    token: TokenData = Depends(auth_guard(required=True)),
    posts_service: PostsService = Depends(get_posts_service)
) -> PostResponse:
    return await posts_service.update_content(token.user, post_id, body)


@router.delete("/{post_id}",
               status_code=status.HTTP_204_NO_CONTENT)
async def posts_delete(
    post_id: str,
    token: TokenData = Depends(auth_guard(required=True)),
    posts_service: PostsService = Depends(get_posts_service)
) -> None:
    return await posts_service.remove(token.user, post_id)
