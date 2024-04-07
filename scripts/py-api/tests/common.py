from pathlib import Path
from generate_api.commons import Endpoint
from generate_api.json_schema import JsonType

import pytest


FIXTURES = Path(__file__).parent / "fixtures"


@pytest.fixture
def expected_endpoints() -> list[Endpoint]:
    def arg(*args):
        return list(args)
    endpoints = [
        dict(
            name="PostsEndpoint",
            attribute="posts",
            methods=[
                dict(name="get_all", method="get", path="/posts"),
                dict(name="get_by_id", method="get",
                     path="/posts/{id}", args=[arg("id")]),
                dict(name="create", method="post",
                     path="/posts", args=[arg("data", "PostsCreateBody")]),
                dict(name="update", method="put",
                     path="/posts/{id}", args=[arg("id"), arg("data", "PostsUpdateBody")]),
                dict(name="delete", method="delete",
                     path="/posts/{id}", args=[arg("id")]),
            ],
        ),
        dict(
            name="CommentsEndpoint",
            attribute="comments",
            methods=[
                dict(name="get_all", method="get", path="/comments"),
                dict(name="get_by_id", method="get",
                     path="/comments/{id}", args=[arg("id", "str")]),
                dict(name="create", method="post",
                     path="/comments", args=[arg("data", "CommentsCreateBody")]),
                dict(name="update", method="put",
                     path="/comments/{id}", args=[dict(name="id", type="str"), arg("data", "CommentsUpdateBody")]),
                dict(name="delete", method="delete",
                     path="/comments/{id}", args=[arg("id", "str")]),
            ]
        )
    ]
    return [Endpoint.from_dict(it) for it in endpoints]


@pytest.fixture
def expected_types() -> list[JsonType]:
    types = [
        dict(
            name="PostsCreateBody",
            schema=dict(
                type="object",
                properties=dict(
                    title=dict(type="string"),
                    content=dict(type="string"),
                    author=dict(type="string"),
                ),
                optionals=["author"],
            ),
        ),
        dict(
            name="PostsUpdateBody",
            schema=dict(
                type="object",
                properties=dict(
                    content=dict(type="string"),
                ),
            ),
        ),
        dict(
            name="CommentsCreateBody",
            schema=dict(
                type="object",
                properties=dict(
                    content=dict(type="string"),
                    author=dict(type="string"),
                ),
                optionals=["author"],
            ),
        ),
        dict(
            name="CommentsUpdateBody",
            schema=dict(
                type="object",
                properties=dict(
                    content=dict(type="string"),
                ),
            ),
        ),
    ]
    return [JsonType.from_dict(it) for it in types]
