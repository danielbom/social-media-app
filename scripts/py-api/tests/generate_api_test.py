from typing import List
from pathlib import Path
from generate_api.generate_api import get_generate_api
from generate_api.commons import Endpoint, ExternalTypeAction

from tests.common import FIXTURES, expected_endpoints

import pytest


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
