from pathlib import Path
from generate_api.commons import Endpoint
from generate_api.generate_api import get_generate_api, get_generate_directory_api
from generate_api.generate_endpoints_swagger import generate_endpoints_swagger
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


def command_generate_endpoints(args):
    with Path(args.input).open("r") as f:
        swagger = json.load(f)
    endpoints = generate_endpoints_swagger(swagger)
    with Path(args.output).open("w") as f:
        json.dump([it.to_dict() for it in endpoints], f, indent=2)


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

    sb = command(command_generate_endpoints)
    sb.add_argument("--input", "-i", type=str, required=True)
    sb.add_argument("--output", "-o", type=str, default="endpoints.json")

    return parser


if __name__ == "__main__":
    parser = get_parser()
    args = parser.parse_args()
    if args.command:
        args.func(args)
    else:
        parser.print_help()
