from .commons import Arg, Endpoint, ExternalTypeAction, Method
from .name_transform import snake_to_camel_case


template = """
import axios from "axios";
{import_external_types}
export class Config {
  constructor(public baseUrl: string) {}
}

{endpoints}
export class Api {
{meta_attributes}
  constructor(public config: Config) {
{attributes}
  }
}
{export_external_types}
"""

class_template = """
class {name} {
  constructor(public config: Config) {}
{methods}
}
"""

type_primitives = {
    "int": "number",
    "float": "number",
    "bool": "boolean",
    "str": "string",
    "None": "null",
    "Any": "any",
}


def arg_to_string(arg: Arg):
    return f"{arg.name}: {type_primitives.get(arg.type, arg.type or 'any')}"


def method_args_as_string(method: list[str]):
    return ", ".join(arg_to_string(it) for it in method.args)


def method_request_args_as_string(method: Method):
    if any(it.name == "data" for it in method.args):
        return ", data"
    return ""


def method_as_string(method: Method) -> str:
    method_args = method_args_as_string(method)
    request_args = method_request_args_as_string(method)
    path = method.path.replace("{", "${")
    return '\n'.join([
        f'  {snake_to_camel_case(method.name)}({method_args}) {{',
        f'    return axios.{method.method}(`${{this.config.baseUrl}}{path}`{request_args});',
        f'  }}',
    ])


def generate_endpoint(endpoint: Endpoint):
    result = class_template.strip()
    result = result.replace("{name}", endpoint.name)
    methods = []
    methods = [method_as_string(method)
               for method in endpoint.methods]
    result = result.replace("{methods}", "\n" + "\n\n".join(methods))
    return result


def generate_endpoints(endpoints: list[Endpoint]):
    return "\n\n".join([generate_endpoint(endpoint) for endpoint in endpoints]) + "\n"


def generate_meta_attributes(endpoints: list[Endpoint]):
    return "\n".join([f"  public {endpoint.attribute}: {endpoint.name};" for endpoint in endpoints]) + "\n"


def generate_attributes(endpoints: list[Endpoint]):
    return "\n".join([f"    this.{endpoint.attribute} = new {endpoint.name}(config);" for endpoint in endpoints])


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
            types = ', '.join(external_types)
            return f'import {{ {types} }} from "./types";\n'
    return ""


def generate_export_external_types(endpoints: list[Endpoint], external_types_action: ExternalTypeAction):
    if external_types_action == "export":
        external_types = collect_external_types(endpoints)
        if external_types:
            return '\n' + '\n'.join(f"export type {it} = any;\n" for it in external_types)
    return ""


def generate_api_typescript(endpoints: list[Endpoint], external_types_action: ExternalTypeAction = "export"):
    result = template.strip()
    result = result.replace("{import_external_types}", generate_import_external_types(
        endpoints, external_types_action))
    result = result.replace("{endpoints}", generate_endpoints(endpoints))
    result = result.replace("{attributes}", generate_attributes(endpoints))
    result = result.replace("{meta_attributes}",
                            generate_meta_attributes(endpoints))
    result = result.replace("{export_external_types}", generate_export_external_types(
        endpoints, external_types_action))
    return result
