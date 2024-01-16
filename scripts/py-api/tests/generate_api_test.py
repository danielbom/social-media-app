import pytest

from pathlib import Path
from generate_api.commons import Endpoint
from generate_api.generate_api_python import generate_api_python
from generate_api.generate_api_javascript import generate_api_javascript
from generate_api.generate_api_typescript import generate_api_typescript


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


@pytest.fixture
def expected_fixture_single_file_python_export():
    return (Path(__file__).parent / "fixtures" / "fixture_single_file_python_export_expected.py").read_text()


@pytest.fixture
def expected_fixture_single_file_python_import():
    return (Path(__file__).parent / "fixtures" / "fixture_single_file_python_import_expected.py").read_text()


@pytest.fixture
def expected_fixture_single_file_javascript():
    return (Path(__file__).parent / "fixtures" / "fixture_single_file_javascript_expected.js").read_text()


@pytest.fixture
def expected_fixture_single_file_typescript_export():
    return (Path(__file__).parent / "fixtures" / "fixture_single_file_typescript_export_expected.ts").read_text()


@pytest.fixture
def expected_fixture_single_file_typescript_import():
    return (Path(__file__).parent / "fixtures" / "fixture_single_file_typescript_import_expected.ts").read_text()


def test_generate_api_python_export(expected_fixture_single_file_python_export, expected_endpoints):
    generated_result = generate_api_python(
        expected_endpoints, external_types_action="export")
    assert generated_result == expected_fixture_single_file_python_export


def test_generate_api_python_import(expected_fixture_single_file_python_import, expected_endpoints):
    generated_result = generate_api_python(
        expected_endpoints, external_types_action="import")
    assert generated_result == expected_fixture_single_file_python_import


def test_generate_api_javascript(expected_fixture_single_file_javascript, expected_endpoints):
    generated_result = generate_api_javascript(expected_endpoints)
    assert generated_result == expected_fixture_single_file_javascript


def test_generate_api_typescript_export(expected_fixture_single_file_typescript_export, expected_endpoints):
    generated_result = generate_api_typescript(
        expected_endpoints, external_types_action="export")
    assert generated_result == expected_fixture_single_file_typescript_export


def test_generate_api_typescript_import(expected_fixture_single_file_typescript_import, expected_endpoints):
    generated_result = generate_api_typescript(
        expected_endpoints, external_types_action="import")
    assert generated_result == expected_fixture_single_file_typescript_import
