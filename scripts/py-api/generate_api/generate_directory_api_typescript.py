from .generate_api_typescript import collect_all_external_types, collect_external_types, generate_attributes, generate_endpoint, generate_exports, generate_imports, generate_meta_attributes
from .commons import Endpoint, ExternalTypeAction, File

template_api_class = r"""
import { Config } from "./Config";
{import_endpoints}
export class Api {
{meta_attributes}
  constructor(public config: Config) {
{attributes}
  }
}
"""

template_config_class = r"""
export class Config {
  constructor(public baseUrl: string) {}
}
"""

template_endpoint_class = r"""
import axios from "axios";
import { Config } from "../Config";
{endpoint_imports}
export {endpoint_class}
{endpoint_exports}
"""

template_index = r"""
export { Api } from "./Api";
export { Config } from "./Config";
{import_types}
"""


def endpoint_path(endpoint: Endpoint, *, extension=False) -> str:
    ext = ".ts" if extension else ""
    return f'./endpoints/{endpoint.name}{ext}'


def generate_import_endpoint(endpoint: Endpoint):
    return f'import {{ {endpoint.name} }} from "{endpoint_path(endpoint)}";'


def generate_import_endpoints(endpoints: list[Endpoint]):
    return "\n".join(generate_import_endpoint(endpoint) for endpoint in endpoints) + "\n"


def generate_api_file(endpoints: list[Endpoint]) -> File:
    result = template_api_class.strip()
    result = result.replace("{meta_attributes}",
                            generate_meta_attributes(endpoints))
    result = result.replace("{attributes}", generate_attributes(endpoints))
    result = result.replace("{import_endpoints}",
                            generate_import_endpoints(endpoints))
    result += "\n"
    return File(name="Api.ts", content=result)


def generate_config_file() -> File:
    return File(name="Config.ts", content=template_config_class.strip() + "\n")


def generate_directory_endpoint(endpoint: Endpoint, external_types_action: ExternalTypeAction) -> str:
    result = template_endpoint_class
    result = result.replace("{endpoint_class}", generate_endpoint(endpoint))
    endpoint_imports = ""
    endpoint_exports = ""
    if external_types_action == "import":
        endpoint_imports = generate_imports(
            collect_external_types(endpoint), import_path="../types")
    elif external_types_action == "export":
        endpoint_exports = "\n" + \
            generate_exports(collect_external_types(endpoint))
    result = result.replace("{endpoint_imports}", endpoint_imports)
    result = result.replace("{endpoint_exports}", endpoint_exports)
    return result.strip() + "\n"


def generate_endpoint_file(endpoint: Endpoint, external_types_action: ExternalTypeAction) -> File:
    return File(name=endpoint_path(endpoint, extension=True), content=generate_directory_endpoint(endpoint, external_types_action))


def generate_endpoints_files(endpoints: list[Endpoint], external_types_action: ExternalTypeAction) -> list[File]:
    return [generate_endpoint_file(endpoint, external_types_action) for endpoint in endpoints]


def generate_import_types_file(types: list[str]) -> File:
    return File(name="./types.ts", content=generate_exports(types))


def generate_export_types_file(endpoints: list[Endpoint]) -> File:
    result = []
    for endpoint in endpoints:
        types = collect_external_types(endpoint)
        if types:
            result.append(f'export type * from "{endpoint_path(endpoint)}";')
    return File(name="./types.ts", content="\n".join(result) + "\n")


def generate_index_import_types(types: list[str]) -> str:
    if types:
        return 'export type * from "./types";\n'
    return ""


def generate_index_file(types: list[str]) -> File:
    result = template_index.strip()
    result = result.replace(
        "{import_types}", generate_index_import_types(types))
    return File(name="./index.ts", content=result)


def generate_directory_api_typescript(endpoints: list[Endpoint], external_types_action: ExternalTypeAction = "export") -> list[File]:
    types = collect_all_external_types(endpoints)
    files = []
    if types:
        if external_types_action == 'import':
            files.append(generate_import_types_file(types))
        elif external_types_action == 'export':
            files.append(generate_export_types_file(endpoints))

    files.append(generate_api_file(endpoints))
    files.append(generate_config_file())
    files.extend(generate_endpoints_files(endpoints, external_types_action))
    files.append(generate_index_file(types))
    return files
