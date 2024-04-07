from pathlib import Path

from generate_api.commons import Endpoint, ExternalTypeAction
from generate_api.generate_api import get_generate_api
from generate_api.json_schema import JsonType

from tests.common import FIXTURES, expected_endpoints, expected_types

import pytest


@pytest.mark.parametrize("language,external_types_action,expected_path", [
    ("python", "export", FIXTURES / "api_export.py"),
    ("python", "import", FIXTURES / "api_import.py"),
    ("javascript", "ignore", FIXTURES / "api.js"),
    ("typescript", "export", FIXTURES / "api_export.ts"),
    ("typescript", "import", FIXTURES / "api_import.ts"),
])
def test_generate_api(expected_endpoints: list[Endpoint], expected_types: list[JsonType], language: str, external_types_action: ExternalTypeAction, expected_path: Path):
    generate_api = get_generate_api(language)
    actual = generate_api(expected_endpoints, expected_types, external_types_action)
    expected = expected_path.read_text()
    assert actual == expected
