import pytest
from generate_api.generate_types_swagger import generate_types_swagger


def using(schemas):
    return {"components": {"schemas": schemas}}


@pytest.mark.parametrize("swagger_schema,expected", [
    (None, []),
    ({}, []),
    ({"components": {}}, []),
    ({"components": {"schemas": {}}}, []),

    (using({"Null": {"type": "null"}}),
     [{"name": "Null", "schema": {"type": "null"}}]),

    (using({"Boolean": {"type": "boolean"}}),
     [{"name": "Boolean", "schema": {"type": "boolean"}}]),

    (using({"String": {"type": "string"}}),
     [{"name": "String", "schema": {"type": "string"}}]),

    (using({"Float": {"type": "number"}}),
     [{"name": "Float", "schema": {"type": "number", "format": "float"}}]),
    (using({"Int": {"type": "integer"}}),
     [{"name": "Int", "schema": {"type": "number", "format": "int"}}]),

    (using({"Array": {"type": "array", "items": {"type": "string"}}}),
     [{"name": "Array", "schema": {"type": "array", "items": {"type": "string"}}}]),

    (using({"Any": {"type": "object"}}),
     [{"name": "Any", "schema": {"type": "any"}}]),
    (using({"Any": {"type": "object", "properties": {}}}),
     [{"name": "Any", "schema": {"type": "any"}}]),
    (using({"Any": {"type": "object", "properties": {"a": {"type": "string"}}}}),
     [{"name": "Any", "schema": {"type": "object", "properties": {"a": {"type": "string"}}}}]),

    (using({"Ref": {"$ref": "#/components/schemas/RefName"}}),
     [{"name": "Ref", "schema": {"type": "ref", "ref": "RefName"}}]),
])
def test_generate_types_swagger(swagger_schema, expected):
    actual_schema = generate_types_swagger(swagger_schema)
    actual = [it.to_dict() for it in actual_schema]
    assert actual == expected
