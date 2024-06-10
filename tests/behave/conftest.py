# https://stackoverflow.com/questions/41146633/how-to-integrate-behave-into-pytest
import pytest
from pathlib import Path
from shlex import split
import subprocess
import json


def pytest_collect_file(parent, path):
    """Allow .feature files to be parsed for bdd."""
    if path.ext == ".feature":
        return BehaveFile.from_parent(parent, fspath=path)


class BehaveException(Exception):
    """Custom exception for error reporting."""


class BehaveFile(pytest.File):
    def collect(self):
        from behave.parser import parse_file
        feature = parse_file(self.fspath)
        for scenario in feature.walk_scenarios(with_outlines=True):
            yield BehaveFeature.from_parent(
                self,
                name=scenario.name,
                feature=feature,
                scenario=scenario,
            )


class BehaveFeature(pytest.Item):
    """Represents feature element in pytest derived from basic test item"""

    def __init__(self, name, parent, feature, scenario):
        super().__init__(name, parent)
        self._feature = feature
        self._scenario = scenario
        self._working_folder_path = Path(self.fspath).parent.parent

        # the following characters cause trouble in shell, so we need to escape them
        name_escaped = str(self._scenario.name).replace('"', '\\"').replace(
            '(', '\\(').replace(')', '\\)').replace('*', '\\*')
        self._cmd = split(f"""behave
            --format json
            --no-summary
            --include {self._feature.filename}
            --name "{name_escaped}"
        """)

    def runtest(self):
        proc = subprocess.run(self._cmd, stdout=subprocess.PIPE,
                              cwd=self._working_folder_path, check=False)
        stdout = proc.stdout.decode("utf8")
        if proc.returncode != 0:
            raise BehaveException(self, stdout)
        result = json.loads(stdout)
        for feature in result:
            if feature['status'] == "failed":
                raise BehaveException(self, stdout)

    def repr_failure(self, excinfo, style=None):
        """Called when self.runtest() raises an exception."""

        if isinstance(excinfo.value, BehaveException):
            feature = excinfo.value.args[0]._feature
            results = excinfo.value.args[1]
            summary = ""
            try:
                data = json.loads(results)
            except json.decoder.JSONDecodeError:
                summary += f'Unexpected error while running tests from behave feature {feature}\n'
                summary += f'Command was {self._cmd}'
                summary += results
                return summary

            for feature in data:
                if feature['status'] != "failed":
                    continue
                summary += f"\nFeature: {feature['name']}"
                for element in feature["elements"]:
                    if element['status'] != "failed":
                        continue
                    summary += f"\n  {element['type'].title()}: {element['name']}"
                    for step in element["steps"]:
                        try:
                            result = step['result']
                        except KeyError:
                            summary += f"\n    Step [NOT REACHED]: {step['name']}"
                            continue
                        status = result['status']
                        if status != "failed":
                            summary += f"\n    Step [OK]: {step['name']}"
                        else:
                            summary += f"\n    Step [ERR]: {step['name']}"
                            summary += "\n      " + \
                                "\n      ".join(result['error_message'])

            return summary
        else:
            raise BehaveException(
                f'Unknown error happened while running tests, excinfo={excinfo}')

    def reportinfo(self):
        return self.fspath, 0, f"Feature: {self._feature.name}  - Scenario: {self._scenario.name}"
