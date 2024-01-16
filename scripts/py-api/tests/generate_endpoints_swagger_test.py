from generate_api.generate_endpoints_swagger import generate_endpoints_swagger
import json

from tests.common import FIXTURES


def test_generate_endpoints_swagger():
    swagger_path = FIXTURES / "endpoints_swagger.json"
    with swagger_path.open("r") as f:
        swagger = json.load(f)

    actual_dict = generate_endpoints_swagger(swagger)
    actual = json.dumps([it.to_dict() for it in actual_dict], indent=2)

    expected_path = FIXTURES / "fixture_endpoints_swagger.json"
    expected = expected_path.read_text()

    assert actual == expected
