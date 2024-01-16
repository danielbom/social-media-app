from typing import List
from pathlib import Path
from generate_api.commons import Endpoint, ExternalTypeAction
from generate_api.generate_api_python import generate_api_python
from generate_api.generate_api_javascript import generate_api_javascript
from generate_api.generate_api_typescript import generate_api_typescript

import pytest

FIXTURES = Path(__file__).parent / "fixtures"


@pytest.mark.parametrize("language,external_types_action,expected_path", [
    ("python", "export", FIXTURES / "fixture_single_file_python_export_expected.py"),
    ("python", "import", FIXTURES / "fixture_single_file_python_import_expected.py"),
    ("javascript", "ignore", FIXTURES / "fixture_single_file_javascript_expected.js"),
    ("typescript", "export", FIXTURES /
     "fixture_single_file_typescript_export_expected.ts"),
    ("typescript", "import", FIXTURES /
     "fixture_single_file_typescript_import_expected.ts"),
])
def test_generate_api(expected_endpoints: List[Endpoint], language: str, external_types_action: ExternalTypeAction, expected_path: Path):
    generate_api = get_generate_api_from_language(language)
    actual = generate_api(expected_endpoints, external_types_action)
    expected = expected_path.read_text()
    assert actual == expected


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


def get_generate_api_from_language(language: str):
    if language == "python":
        return generate_api_python
    elif language == "javascript":
        return generate_api_javascript
    elif language == "typescript":
        return generate_api_typescript
    else:
        raise ValueError(f"Unknown language: {language}")
