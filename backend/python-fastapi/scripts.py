import argparse
import asyncio
import concurrent.futures
import glob
import itertools
import os
import subprocess
import time
from pathlib import Path


def cmd_run(args, **kwargs):
    print(f"CMD: '{' '.join(args)}'")
    subprocess.run(args, **kwargs)


def format_file(filepath):
    cmd_run(["autopep8", "--in-place", "--aggressive", filepath], check=True)
    cmd_run(["isort", filepath], check=True)


async def format_files():
    files = itertools.chain(
        glob.glob("*.py"),
        glob.glob("server/**/*.py", recursive=True),
        glob.glob("tests/**/*.py", recursive=True)
    )
    with concurrent.futures.ThreadPoolExecutor(os.cpu_count()) as executor:
        for _ in executor.map(format_file, files):
            pass


async def command_format(args: argparse.Namespace) -> None:
    await format_files()


async def command_run(args: argparse.Namespace) -> None:
    # , "--log-config", "logging_config.ini"]
    cmd = ["uvicorn", "server.main:app"]
    if args.dev:
        cmd += ["--reload"]
        cmd += ["--reload-dir", "server"]
    else:
        cmd += ["--host", "0.0.0.0"]
    if args.port is not None:
        cmd += ["--port", str(args.port)]
    else:
        from server.env import env
        cmd += ["--port", str(env.port)]
    cmd_run(cmd)


async def command_venv(_args: argparse.Namespace) -> None:
    cmd_run(["python", "-m", "venv", "venv"])


async def command_tip(_args: argparse.Namespace) -> None:
    print("# 1. To create a virtual environment, run:")
    print()
    print("python3 -m venv venv")
    print("# or:")
    print("python scripts.py venv")
    print()
    print()
    print("# 2. To activate the virtual environment, run:")
    print()
    print("# For linux:")
    print("source venv/bin/activate")
    print()
    print("# For windows powershell:")
    print(".\\venv\\Scripts\\Activate.ps1")
    print()
    print()
    print("# 3. To install dependencies, run:")
    print()
    print("pip install -r requirements.txt")
    print("# or:")
    print("python scripts.py install")
    print()
    print()
    print("# 4. To run the server, run:")
    print()
    print("# In production:")
    print("uvicorn api:app --log-config logging_config.ini")
    print("# or:")
    print("python scripts.py run")
    print()
    print("# In development:")
    print("uvicorn api:app --log-config logging_config.ini --reload")
    print("# or:")
    print("python scripts.py run --dev")
    print()


async def command_install(args: argparse.Namespace) -> None:
    cmd_run(["pip", "install", "-r", "requirements.txt"])
    if args.dev:
        cmd_run(["pip", "install", "-r", "requirements-dev.txt"])


async def command_check_types(_args: argparse.Namespace) -> None:
    cmd_run(["mypy", "."])


async def command_lint(_args: argparse.Namespace) -> None:
    """Lint all Python files."""
    folders = ["server", "tests"]
    cmd_run(["isort", "--check", "--diff", "./server"])
    # cmd_run(["blue", "--check", "--diff", "--color", "."])
    # cmd_run(["flake8", "."])
    cmd_run(['mypy', '.'])


async def command_test(args: argparse.Namespace) -> None:
    cmd = ["pytest", "tests/"]
    if args.cov:
        cmd += ["--verbose", "--cov=server", "--cov-report=term-missing"]
    else:
        cmd += ["--verbose", "--capture=no", "--exitfirst"]
    cmd_run(cmd)


def command_install_service(args):
    cmd_run(["sudo", "cp", "../extras/fastapi.service",
            "/etc/systemd/system/fastapi.service"])
    cmd_run(["sudo", "systemctl", "daemon-reload"])
    cmd_run(["sudo", "systemctl", "enable", "fastapi"])
    cmd_run(["sudo", "systemctl", "start", "fastapi"])


def get_parser():
    parser = argparse.ArgumentParser()
    subparser = parser.add_subparsers(dest="command")

    sp = subparser.add_parser("run", help="Run the server")
    sp.add_argument(
        '--dev', action='store_true',
        help="Run in development mode")
    sp.add_argument('--port', type=int, help="Port to run on")
    sp.set_defaults(func=command_run)

    sp = subparser.add_parser("format", help="Format python files")
    sp.set_defaults(func=command_format)

    sp = subparser.add_parser("check-types", help="Check types with mypy")
    sp.set_defaults(func=command_check_types)

    sp = subparser.add_parser("lint", help="Lint the code")
    sp.set_defaults(func=command_lint)

    sp = subparser.add_parser("tip", help="Show some tips")
    sp.set_defaults(func=command_tip)

    sp = subparser.add_parser("test", help="Run the tests")
    sp.add_argument(
        '--cov', action='store_true',
        help="Run with coverage")
    sp.set_defaults(func=command_test)

    sp = subparser.add_parser("venv", help="Create a virtual environment")
    sp.set_defaults(func=command_venv)

    sp = subparser.add_parser("install", help="Install dependencies")
    sp.add_argument(
        '--dev', action='store_true',
        help="Install development dependencies")
    sp.set_defaults(func=command_install)

    sp = subparser.add_parser(
        "install-service",
        help="Install the systemd service")
    sp.set_defaults(func=command_install_service)

    return parser


async def main():
    parser = get_parser()
    args = parser.parse_args()
    if args.command is None:
        parser.print_help()
    else:
        await args.func(args)


if __name__ == "__main__":
    asyncio.run(main())
