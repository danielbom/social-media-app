
from dataclasses import dataclass, field
from typing import Literal, Union, Optional


@dataclass
class Arg:
    name: str
    type: Optional[str] = None

    @staticmethod
    def from_dict(d: dict | list) -> "Arg":
        if isinstance(d, list):
            return Arg(*d)
        return Arg(name=d["name"], type=d.get("type"))

    def to_dict(self) -> dict:
        result = {"name": self.name}
        if self.type is not None:
            result["type"] = self.type
        return result


@dataclass
class Method:
    name: str
    method: str
    path: str
    args: list[Arg] = field(default_factory=list)

    @staticmethod
    def from_dict(d: dict) -> "Method":
        return Method(
            name=d["name"],
            method=d["method"],
            path=d["path"],
            args=[Arg.from_dict(it) for it in d.get("args", [])],
        )

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "method": self.method,
            "path": self.path,
            "args": [it.to_dict() for it in self.args],
        }


@dataclass
class Endpoint:
    name: str
    attribute: str
    methods: list[Method]

    @staticmethod
    def from_dict(d: dict) -> "Endpoint":
        return Endpoint(
            name=d["name"],
            attribute=d["attribute"],
            methods=[Method.from_dict(it) for it in d["methods"]],
        )

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "attribute": self.attribute,
            "methods": [it.to_dict() for it in self.methods],
        }


@dataclass
class File:
    name: str
    content: str


ExternalTypeAction = Union[Literal["import"],
                           Literal["ignore"],
                           Literal["export"]]
