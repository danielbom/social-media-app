from typing import List
from .json_schema import JsonAny, JsonArray, JsonBoolean, JsonNull, JsonNumber, JsonRef, JsonString, JsonObject, JsonSchema, JsonType


def swagger_to_json_schema(swagger_schema: dict) -> JsonSchema:
    s = swagger_schema
    if "$ref" in s:
        return JsonRef(s["$ref"].split("/")[-1])
    elif s["type"] == "object":
        if not s.get("properties"):
            return JsonAny()
        properties = {k: swagger_to_json_schema(v)
                      for k, v in s["properties"].items()}
        optionals = set(s.get("required", [])) - set(properties.keys())
        return JsonObject(properties, optionals)
    elif s["type"] == "array":
        return JsonArray(swagger_to_json_schema(s["items"]))
    elif s["type"] == "string":
        return JsonString(
            enum=s.get("enum"),
            format=s.get("format"),
            min_length=s.get("minLength"),
            max_length=s.get("maxLength")
        )
    elif s["type"] == "integer":
        return JsonNumber(format="int")
    elif s["type"] == "number":
        return JsonNumber(format="float")
    elif s["type"] == "boolean":
        return JsonBoolean()
    elif s["type"] == "null":
        return JsonNull()
    else:
        raise ValueError(f"Unknown type {s['type']}")


def generate_types_swagger(swagger_schema: dict) -> List[JsonType]:
    if not isinstance(swagger_schema, dict):
        return []
    if "components" not in swagger_schema:
        return []
    if "schemas" not in swagger_schema["components"]:
        return []
    types = []
    for key, value in swagger_schema["components"]["schemas"].items():
        schema = swagger_to_json_schema(value)
        types.append(JsonType(name=key, schema=schema))
    return types
