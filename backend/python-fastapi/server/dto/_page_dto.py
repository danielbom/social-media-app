from typing import Generic, List, TypeVar

from pydantic import BaseModel

T = TypeVar('T')


class PageResponse(BaseModel, Generic[T]):
    page: int
    pageSize: int
    totalPages: int
    totalItems: int
    isLast: bool
    items: List[T]

    @staticmethod
    def make(items: List[T], count: int, page: int,
             pageSize: int) -> 'PageResponse[T]':
        totalPages = count // pageSize + 1 if pageSize else 1
        return PageResponse(
            page=page,
            pageSize=pageSize,
            totalPages=totalPages,
            totalItems=count,
            isLast=totalPages == page or count == 0,
            items=items,
        )
