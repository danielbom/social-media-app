from pathlib import Path
from generate_api.generate_api import get_generate_directory_api
from generate_api.commons import Endpoint, ExternalTypeAction

import pytest

from generate_api.json_schema import JsonType
from tests.common import FIXTURES, expected_endpoints, expected_types


@pytest.mark.parametrize("language,external_types_action,expected_directory", [
    ("typescript", "export", FIXTURES / "api_export_ts"),
    ("typescript", "import", FIXTURES / "api_import_ts"),
])
def test_generate_directory_api(expected_endpoints: list[Endpoint], expected_types: list[JsonType], language: str, external_types_action: ExternalTypeAction, expected_directory: Path):
    generate_directory_api = get_generate_directory_api(language)
    actual_files = generate_directory_api(
        expected_endpoints, expected_types, external_types_action)

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
    assert sorted(expected_files) == sorted(actual_files)
