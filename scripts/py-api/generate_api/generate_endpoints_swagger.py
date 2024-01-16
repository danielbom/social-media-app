

from typing import Optional
from .commons import Arg, Endpoint, Method
from .name_transform import snake_to_pascal_case, to_snake_case

import re


type_primitives = {
    "integer": "int",
    "number": "float",
    "boolean": "bool",
    "string": "str",
    "null": "None",
    "any": "Any",
    "object": "dict",
    "array": "list",
}


def arg(name: str, typ: Optional[str], _loc: str):
    typ = type_primitives.get(typ, typ or "Any")
    return Arg(name, typ)


def collect_type(schema: dict) -> str:
    if "type" in schema:
        return type_primitives.get(schema["type"], schema["type"])
    elif "$ref" in schema:
        return schema["$ref"].split("/")[-1]
    return None


def generate_endpoints_swagger(swagger: dict) -> list[Endpoint]:
    paths = swagger["paths"]
    endpoints = {}
    for path, methods in paths.items():
        for method, data in methods.items():
            [endpoint_name, method_name] = data["operationId"].split("_")
            endpoint_name = to_snake_case(endpoint_name)
            endpoint_name = re.sub(r"_controller$", "_endpoint", endpoint_name)
            attribute_name = re.sub(r"_endpoint$", "", endpoint_name)
            endpoint_name = snake_to_pascal_case(endpoint_name)
            method_name = to_snake_case(method_name)
            if endpoint_name not in endpoints:
                endpoint = Endpoint(
                    name=endpoint_name,
                    attribute=attribute_name,
                    methods=[],
                )
                endpoints[endpoint_name] = endpoint
            else:
                endpoint = endpoints[endpoint_name]

            args = []
            body = None
            for parameter in data["parameters"]:
                if parameter["in"] == "path":
                    name = parameter["name"]
                    typ = collect_type(parameter.get("schema", {}))
                    args.append(arg(name, typ, "path"))

                if parameter["in"] == "query":
                    name = parameter["name"]
                    typ = collect_type(parameter.get("schema", {}))
                    args.append(arg(name, typ, "query"))

                if parameter["in"] == "body":
                    body = collect_type(parameter.get("schema", {}))

            if body is None:
                body_schema = data.get("requestBody", {}).get(
                    "content", {}).get("application/json", {}).get("schema", {})
                body = collect_type(body_schema)
            if body is not None or method in ["post", "put", "patch"]:
                args.append(Arg("data", body))

            endpoint.methods.append(
                Method(name=method_name, method=method, path=path, args=args))
    return list(endpoints.values())
