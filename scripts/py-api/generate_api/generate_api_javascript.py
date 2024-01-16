
from .commons import Arg, Endpoint, ExternalTypeAction, Method
from .name_transform import snake_to_camel_case

template = """
import axios from "axios";

export class Config {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
}
{endpoints}
export class Api {
  constructor(config) {
    this.config = config;
{attributes}
  }
}
"""

class_template = """
class {name} {
  constructor(config) {
    this.config = config;
  }
{methods}
}
"""


def arg_to_string(arg: Arg):
    return arg.name


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
    methods = [method_as_string(method)
               for method in endpoint.methods]
    if methods:
        methods = "\n" + "\n\n".join(methods)
    result = result.replace("{methods}", methods)
    return "\n" + result


def generate_endpoints(endpoints: list[Endpoint]):
    return "\n".join([generate_endpoint(endpoint) for endpoint in endpoints]) + "\n"


def generate_attributes(endpoints: list[Endpoint]):
    return "\n".join([f"    this.{endpoint.attribute} = new {endpoint.name}(config);" for endpoint in endpoints])


def generate_api_javascript(endpoints: list[Endpoint], external_types_action: ExternalTypeAction = "ignore"):
    result = template.strip()
    result = result.replace("{endpoints}", generate_endpoints(endpoints))
    result = result.replace("{attributes}", generate_attributes(endpoints))
    result += "\n"
    return result
