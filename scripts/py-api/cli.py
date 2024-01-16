import json
from pathlib import Path
from generate_api.commons import Endpoint
from generate_api.generate_api_python import generate_api_python
from generate_api.generate_api_javascript import generate_api_javascript
from generate_api.generate_api_typescript import generate_api_typescript
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


def get_generate_api_from_language(language: str):
    if language == "python":
        return generate_api_python
    elif language == "javascript":
        return generate_api_javascript
    elif language == "typescript":
        return generate_api_typescript
    else:
        raise ValueError(f"Unknown language: {language}")


def command_generate_api(args):
    with Path(args.input).open("r") as f:
        endpoints = json.load(f)
    endpoints = [Endpoint.from_dict(e) for e in endpoints]
    generate_api = get_generate_api_from_language(args.language)
    api = generate_api(endpoints, args.external_types_action)
    suffix = suffix_from_laguage(args.language)
    if args.multiple_file:
        raise NotImplementedError()
    else:
        output = Path(args.output).with_suffix(suffix)
        with output.open("w") as f:
            f.write(api)


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
    sb.add_argument("--multiple-file", action="store_true", default=False)
    sb.add_argument("--external-types-action", "--et", type=str, default="export",
                    choices=["import", "ignore", "export"])

    return parser


if __name__ == "__main__":
    parser = get_parser()
    args = parser.parse_args()
    if args.command:
        args.func(args)
    else:
        parser.print_help()
