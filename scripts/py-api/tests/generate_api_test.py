from typing import List
from pathlib import Path
from generate_api.generate_api import get_generate_api, get_generate_directory_api
from generate_api.commons import Endpoint, ExternalTypeAction

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
    generate_api = get_generate_api(language)
    actual = generate_api(expected_endpoints, external_types_action)
    expected = expected_path.read_text()
    assert actual == expected


@pytest.mark.parametrize("language,external_types_action,expected_directory", [
    ("typescript", "export", FIXTURES /
     "fixture_directory_typescript_export_expected"),
    ("typescript", "import", FIXTURES /
     "fixture_directory_typescript_import_expected"),
])
def test_generate_directory_api(expected_endpoints: List[Endpoint], language: str, external_types_action: ExternalTypeAction, expected_directory: Path):
    generate_directory_api = get_generate_directory_api(language)
    actual_files = generate_directory_api(
        expected_endpoints, external_types_action)

    for actual_file in actual_files:
        expected_file = expected_directory / actual_file.name
        assert expected_file.exists()
        actual = actual_file.content
        expected = expected_file.read_text()
        assert actual == expected

    actual_files = sorted(
        [expected_directory / it.name for it in actual_files])
    expected_files = sorted(
        [it for it in expected_directory.glob("**/*") if it.is_file()])
    assert len(expected_files) == len(actual_files)


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
