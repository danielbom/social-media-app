from pathlib import Path
from generate_api.commons import Endpoint

import pytest


FIXTURES = Path(__file__).parent / "fixtures"


@pytest.fixture
def expected_endpoints():
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
                     path="/posts/{id}", args=[arg("id"), arg("data")]),
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
                     path="/comments", args=[arg("data")]),
                dict(name="update", method="put",
                     path="/comments/{id}", args=[dict(name="id", type="str"), arg("data")]),
                dict(name="delete", method="delete",
                     path="/comments/{id}", args=[arg("id", "str")]),
            ]
        )
    ]
    return [Endpoint.from_dict(it) for it in endpoints]
