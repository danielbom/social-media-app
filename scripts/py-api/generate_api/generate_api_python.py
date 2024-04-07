

from .commons import Arg, Endpoint, ExternalTypeAction, Method
from .json_schema import JsonType


template = """
from dataclasses import dataclass
import requests
{import_external_types}{export_external_types}

@dataclass
class Config:
    base_url: str

{endpoints}

class Api:
    def __init__(self, base_url: str):
        self.config = Config(base_url)
{attributes}
"""

class_template = """
class {name}:
    def __init__(self, config: Config) -> None:
        self.config = config

"""

type_primitives = {
    "int",
    "float",
    "bool",
    "str",
    "None",
    "Any",
}


def arg_to_string(arg: Arg):
    if arg.type:
        return f"{arg.name}: {arg.type}"
    return arg.name


def method_args_as_string(method: list[Arg]):
    args = ", ".join(arg_to_string(it) for it in method.args)
    return "self, " + args if args else "self"


def method_request_args_as_string(method: Method):
    if any(it.name == "data" for it in method.args):
        return ", json=data"
    return ""


def method_as_string(method: Method) -> str:
    method_args = method_args_as_string(method)
    request_args = method_request_args_as_string(method)
    return '\n'.join([
        f'    def {method.name}({method_args}):',
        f'        return requests.{method.method}(f"{{self.config.base_url}}{method.path}"{request_args})',
        ''
    ])


def generate_endpoint(endpoint: Endpoint):
    result = class_template.format(name=endpoint.name)
    methods = [method_as_string(method)
               for method in endpoint.methods]
    result += "\n".join(methods)
    return result


def generate_endpoints(endpoints: list[Endpoint]):
    return "\n".join([generate_endpoint(endpoint) for endpoint in endpoints])


def generate_attributes(endpoints: list[Endpoint]):
    return "\n".join([f"        self.{endpoint.attribute} = {endpoint.name}(self.config)" for endpoint in endpoints])


def collect_external_types(endpoints: list[Endpoint]):
    external_types = []
    for endpoint in endpoints:
        for method in endpoint.methods:
            for arg in method.args:
                if arg.type and arg.type not in type_primitives:
                    external_types.append(arg.type)
    return external_types


def generate_import_external_types(endpoints: list[Endpoint], external_types_action: ExternalTypeAction):
    if external_types_action == "import":
        external_types = collect_external_types(endpoints)
        if external_types:
            external_types = ", ".join(external_types)
            return f"from .types import {external_types}\n"
    return ""


def generate_export_external_types(endpoints: list[Endpoint], external_types_action: ExternalTypeAction):
    if external_types_action == "export":
        external_types = collect_external_types(endpoints)
        if external_types:
            exports = ["from typing import Any", "", ""]
            exports += [f"{it} = Any" for it in external_types]
            return '\n'.join(exports) + '\n'
    return ""


def generate_api_python(endpoints: list[Endpoint], types: list[JsonType], external_types_action: ExternalTypeAction = "export"):
    result = template.strip()
    result = result.format(
        import_external_types=generate_import_external_types(
            endpoints, external_types_action),
        export_external_types=generate_export_external_types(
            endpoints, external_types_action),
        endpoints=generate_endpoints(endpoints),
        attributes=generate_attributes(endpoints))
    result += "\n"
    return result
