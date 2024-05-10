import argparse
import concurrent.futures
import glob
import itertools
import os
import subprocess
import sys


def call_location():
    line = sys._getframe(1).f_lineno
    caller = sys._getframe(1).f_code.co_name
    return f"scripts/{__file__.split('scripts', 1)[1]}:{line} {caller}"


def cmd_run(args):
    print(f"CMD: '{' '.join(args)}'")
    subprocess.run(args, check=True)


def format_file(file):
    cmd_run(["pyupgrade", "--py3-only", file])
    cmd_run(["autopep8", "--in-place", "--aggressive", file])
    cmd_run(["isort", file])


def command_format(args):
    """Format all Python files."""
    print(f"RUN: {call_location()}")
    files = itertools.chain(
        glob.glob("*.py"),
        glob.glob("scripts/*.py", recursive=True),
        glob.glob("app/**/*.py", recursive=True),
        glob.glob("tests/**/*.py", recursive=True)
    )
    with concurrent.futures.ThreadPoolExecutor(os.cpu_count()) as executor:
        for _ in executor.map(lambda file: format_file(file), files):
            pass


def command_run(args):
    """Run the FastAPI application."""
    print(f"RUN: {call_location()}")
    if args.workers > 1:
        return cmd_run(["gunicorn",
                        "--workers", f"{args.workers}",
                        "--worker-class", "uvicorn.workers.UvicornWorker",
                        "--bind", f"0.0.0.0:{args.port}",
                        "--log-level", "info",
                        "app.main:app"])
    else:
        return cmd_run(["uvicorn",
                        "--host", "0.0.0.0",
                        "--port", f"{args.port}",
                        "--log-level", "info",
                        *(["--reload"] if args.dev else []),
                        "app.main:app"])


def command_lint(args):
    """Lint all Python files."""
    print(f"RUN: {call_location()}")
    cmd_run(["isort", "--check", "--diff", "./app"])
    # cmd_run(["blue", "--check", "--diff", "--color", "."])
    # cmd_run(["flake8", "."])
    # cmd_run(["mypy", "./app", "--ignore-missing-imports"])
    cmd_run(["mypy", "--strict", "./app", "--ignore-missing-imports"])


def command_test(args):
    """Run the tests."""
    print(f"RUN: {call_location()}")
    cmd_run(["pytest", "-v", "-s", "-x",
             *(["--cov=app", "--cov-report=term-missing"] if args.coverage else [])])


def command_test_security(args):
    """Run the security tests."""
    print(f"RUN: {call_location()}")
    cmd_run(["bandit", "-r", "app"])
    # cmd_run(["safety", "check", "--full-report"])


def command_install_service(args):
    """Install the systemd service."""
    print(f"RUN: {call_location()}")
    cmd_run(["sudo", "cp", "../extras/fastapi.service",
            "/etc/systemd/system/fastapi.service"])
    cmd_run(["sudo", "systemctl", "daemon-reload"])
    cmd_run(["sudo", "systemctl", "enable", "fastapi"])
    cmd_run(["sudo", "systemctl", "start", "fastapi"])


def get_parser():
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers(dest="command")

    def registry_command(func):
        name = func.__name__.replace("command_", "").replace("_", "-")
        sb = subparsers.add_parser(name)
        sb.usage = func.__doc__
        sb.set_defaults(func=func)
        return sb

    sb = registry_command(command_run)
    sb.add_argument("--workers", type=int, default=1,
                    help="number of workers to use (only for Gunicorn)")
    sb.add_argument("--port", type=int, default=8000,
                    help="port to bind the application")
    sb.add_argument("--dev", action="store_true",
                    help="enable auto-reload")

    sb = registry_command(command_format)

    sb = registry_command(command_lint)

    sb = registry_command(command_test)
    sb.add_argument("--coverage", action="store_true",
                    help="enable coverage report")

    sb = registry_command(command_test_security)

    return parser


def main():
    parser = get_parser()

    args = parser.parse_args()
    if args.command is None:
        parser.print_help()
        return

    args.func(args)


if __name__ == "__main__":
    main()
