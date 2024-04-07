from generate_api.extract_endpoints_swagger import extract_endpoints_swagger
from tests.common import FIXTURES

import json
import pytest


@pytest.mark.parametrize("swagger_path,endpoints_path", [
    (FIXTURES / "endpoints_swagger.json", FIXTURES / "swagger_endpoints.json"),
])
def test_extract_endpoints_swagger(swagger_path, endpoints_path):
    with swagger_path.open("r") as f:
        swagger = json.load(f)

    actual_dict = extract_endpoints_swagger(swagger)
    actual = json.dumps([it.to_dict() for it in actual_dict], indent=2)

    expected = endpoints_path.read_text()

    assert actual == expected
