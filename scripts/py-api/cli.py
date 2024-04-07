from pathlib import Path
from generate_api.commons import Endpoint
from generate_api.json_schema import JsonType
from generate_api.generate_types import get_generate_types
from generate_api.generate_api import get_generate_api, get_generate_directory_api
from generate_api.extract_endpoints_swagger import extract_endpoints_swagger
from generate_api.extract_types_swagger import extract_types_swagger

import json
import argparse


def suffix_from_laguage(language: str):
    if language == "python":
        return ".py"
    elif language == "javascript":
        return ".js"
    elif language == "typescript":
        return ".ts"
    else:
        return ""


def load_endpoints_from_file(path: str):
    with Path(path).open("r") as f:
        endpoints = json.load(f)
    return [Endpoint.from_dict(e) for e in endpoints]


def load_json_types_from_file(path: str):
    with Path(path).open("r") as f:
        types = json.load(f)
    return [JsonType.from_dict(t) for t in types]


def command_generate_api(args):
    if args.multiple_files:
        endpoints = load_endpoints_from_file(args.input)
        generate_directory_api = get_generate_directory_api(
            args.language)
        files = generate_directory_api(endpoints, args.external_types_action)
        output_dir = Path(args.output)
        output_dir.mkdir(exist_ok=True)
        for file in files:
            output_path = output_dir / file.name
            if output_path.parent != output_dir:
                output_path.parent.mkdir(exist_ok=True, parents=True)
            with output_path.open("w") as f:
                f.write(file.content)
    else:
        endpoints = load_endpoints_from_file(args.input)
        generate_api = get_generate_api(args.language)
        api = generate_api(endpoints, args.external_types_action)
        suffix = suffix_from_laguage(args.language)
        output = Path(args.output).with_suffix(suffix)
        with output.open("w") as f:
            f.write(api)


def command_extract_endpoints(args):
    with Path(args.input).open("r") as f:
        swagger = json.load(f)
    endpoints = extract_endpoints_swagger(swagger)
    with Path(args.output).open("w") as f:
        json.dump([it.to_dict() for it in endpoints], f, indent=2)


def command_generate_types(args):
    types = load_json_types_from_file(args.input)
    generate_types = get_generate_types(args.language)
    types_code = generate_types(types)
    suffix = suffix_from_laguage(args.language)
    output = Path(args.output).with_suffix(suffix)
    with output.open("w") as f:
        f.write(types_code)


def command_extract_types(args):
    with Path(args.input).open("r") as f:
        swagger = json.load(f)
    types = extract_types_swagger(swagger)
    with Path(args.output).open("w") as f:
        json.dump([it.to_dict() for it in types], f, indent=2)


def get_parser():
    def command(func):
        name = func.__name__.replace("command_", "").replace("_", "-")
        sb = subparsers.add_parser(name)
        sb.usage = func.__doc__
        sb.set_defaults(func=func)
        return sb
    parser = argparse.ArgumentParser(description='Generate API')

    subparsers = parser.add_subparsers(dest="command")

    sb = command(command_generate_api)
    sb.add_argument("--input", "-i", type=str, required=True)
    sb.add_argument("--output", "-o", type=str, default="api")
    sb.add_argument("--language", "-l", type=str, required=True,
                    choices=["python", "javascript", "typescript"])
    sb.add_argument("--multiple-files", action="store_true", default=False)
    sb.add_argument("--external-types-action", "--et", type=str, default="export",
                    choices=["import", "ignore", "export"])

    sb = command(command_extract_endpoints)
    sb.add_argument("--input", "-i", type=str, required=True)
    sb.add_argument("--output", "-o", type=str, default="endpoints.json")

    sb = command(command_generate_types)
    sb.add_argument("--input", "-i", type=str, required=True)
    sb.add_argument("--output", "-o", type=str, default="types")
    sb.add_argument("--language", "-l", type=str, required=True,
                    choices=["python", "typescript"])

    sb = command(command_extract_types)
    sb.add_argument("--input", "-i", type=str, required=True)
    sb.add_argument("--output", "-o", type=str, default="types.json")

    return parser


if __name__ == "__main__":
    parser = get_parser()
    args = parser.parse_args()
    if args.command:
        args.func(args)
    else:
        parser.print_help()
