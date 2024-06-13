from typing import List

from fastapi import APIRouter, Depends, status

from server.dto.comments_dto import (CommentResponse, CommentsPageResponse,
                                     CreateCommentAnswerBody,
                                     CreateCommentBody, UpdateCommentBody)
from server.services.comments_service import (CommentsService,
                                              get_comments_service)
from server.services.jwt_service import TokenData, auth_guard

router = APIRouter(
    prefix="/comments",
    tags=["Comments"],
)


@router.post("/",
             status_code=status.HTTP_201_CREATED)
async def comments_store(
    body: CreateCommentBody,
    token: TokenData = Depends(auth_guard(required=True)),
    comments_service: CommentsService = Depends(get_comments_service)
) -> CommentResponse:
    return await comments_service.create(token.user, body)


@router.post("/answers",
             status_code=status.HTTP_201_CREATED)
async def comments_answer_store(
    body: CreateCommentAnswerBody,
    token: TokenData = Depends(auth_guard(required=True)),
    comments_service: CommentsService = Depends(get_comments_service)
) -> CommentResponse:
    return await comments_service.create_answer(token.user, body)


@router.get("/")
async def comments_index(
    page: int = 1,
    pageSize: int = 20,
    token: TokenData = Depends(auth_guard(required=True)),
    comments_service: CommentsService = Depends(get_comments_service)
) -> CommentsPageResponse:
    return await comments_service.find_all(token.user, page, pageSize)


@router.get("/{comment_id}")
async def comments_show(
    comment_id: str,
    token: TokenData = Depends(auth_guard(required=True)),
    comments_service: CommentsService = Depends(get_comments_service)
) -> CommentResponse:
    return await comments_service.find_one(token.user, comment_id)


@router.patch("/{comment_id}")
async def comments_update(
    body: UpdateCommentBody,
    comment_id: str,
    token: TokenData = Depends(auth_guard(required=True)),
    comments_service: CommentsService = Depends(get_comments_service)
) -> CommentResponse:
    return await comments_service.update_content(token.user, comment_id, body)


@router.delete("/{comment_id}",
               status_code=status.HTTP_204_NO_CONTENT)
async def comments_delete(
    comment_id: str,
    token: TokenData = Depends(auth_guard(required=True)),
    comments_service: CommentsService = Depends(get_comments_service)
) -> None:
    return await comments_service.delete(token.user, comment_id)
