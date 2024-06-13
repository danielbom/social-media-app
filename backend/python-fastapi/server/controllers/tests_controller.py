from fastapi import APIRouter, Depends, status

from server.services.jwt_service import TokenData, auth_guard
from server.services.tests_service import TestsService, get_tests_service

router = APIRouter(
    prefix="/tests",
    tags=["Tests"],
)


@router.post("/tear-up",
             status_code=status.HTTP_201_CREATED)
async def tests_tear_up(
    tests_service: TestsService = Depends(get_tests_service)
) -> None:
    return await tests_service.tear_up()


@router.post("/tear-down",
             status_code=status.HTTP_201_CREATED)
async def tests_tear_down(
    token: TokenData = Depends(auth_guard(required=True)),
    tests_service: TestsService = Depends(get_tests_service)
) -> None:
    return await tests_service.tear_down(token.user)
