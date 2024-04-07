
from dataclasses import dataclass
from typing import Optional


@dataclass
class JsonAny:
    @property
    def tag(self):
        return "any"

    def to_dict(self):
        return {"type": self.tag}


@dataclass
class JsonNull:
    @property
    def tag(self):
        return "null"

    def to_dict(self):
        return {"type": self.tag}


@dataclass
class JsonRef:
    ref: str

    @property
    def tag(self):
        return "ref"

    def to_dict(self):
        return {"type": self.tag, "ref": self.ref}


@dataclass
class JsonBoolean:
    @property
    def tag(self):
        return "boolean"

    def to_dict(self):
        return {"type": self.tag}


@dataclass
class JsonNumber:
    # int | float
    format: Optional[str] = None
    enum: Optional[list[float]] = None
    minimum: Optional[float] = None
    maximum: Optional[float] = None

    @property
    def tag(self):
        return "number"

    def to_dict(self):
        result = {"type": self.tag}
        if self.format is not None:
            result["format"] = self.format
        if self.enum is not None:
            result["enum"] = self.enum
        if self.minimum is not None:
            result["minimum"] = self.minimum
        if self.maximum is not None:
            result["maximum"] = self.maximum
        return result


@dataclass
class JsonString:
    # date | date-time | email | hostname | ipv4 | ipv6 | uri | uri-reference | uuid | password
    format: Optional[str] = None
    enum: Optional[list[str]] = None
    min_length: Optional[int] = None
    max_length: Optional[int] = None

    @property
    def tag(self):
        return "string"

    def to_dict(self):
        result = {"type": self.tag}
        if self.format is not None:
            result["format"] = self.format
        if self.enum is not None:
            result["enum"] = self.enum
        if self.min_length is not None:
            result["min_length"] = self.min_length
        if self.max_length is not None:
            result["max_length"] = self.max_length
        return result


@dataclass
class JsonArray:
    items: "JsonSchema"
    min_length: Optional[int] = None
    max_length: Optional[int] = None

    @property
    def tag(self):
        return "array"

    def to_dict(self):
        result = {"type": self.tag, "items": self.items.to_dict()}
        if self.min_length is not None:
            result["min_length"] = self.min_length
        if self.max_length is not None:
            result["max_length"] = self.max_length
        return result


@dataclass
class JsonObject:
    properties: dict[str, "JsonSchema"]
    optionals: Optional[set[str]] = None

    @property
    def tag(self):
        return "object"

    def to_dict(self):
        result = {"type": self.tag}
        result["properties"] = {k: v.to_dict()
                                for k, v in self.properties.items()}
        if self.optionals:
            result["optionals"] = list(self.optionals)
        return result


JsonSchema = JsonRef | JsonAny | JsonString | JsonNumber | JsonBoolean | JsonNull | JsonArray | JsonObject


def JsonSchema_from_dict(d: dict):
    tag = d["type"]
    if tag == "any":
        return JsonAny()
    if tag == "null":
        return JsonNull()
    if tag == "ref":
        return JsonRef(d["ref"])
    if tag == "boolean":
        return JsonBoolean()
    if tag == "number":
        return JsonNumber(d.get("format"), d.get("enum"), d.get("minimum"), d.get("maximum"))
    if tag == "string":
        return JsonString(d.get("format"), d.get("enum"), d.get("min_length"), d.get("max_length"))
    if tag == "array":
        return JsonArray(JsonSchema_from_dict(d["items"]), d.get("min_length"), d.get("max_length"))
    if tag == "object":
        return JsonObject({k: JsonSchema_from_dict(v) for k, v in d["properties"].items()}, set(d.get("optionals", [])))


@dataclass
class JsonType:
    name: str
    schema: JsonSchema

    def to_dict(self):
        return {"name": self.name, "schema": self.schema.to_dict()}

    def from_dict(d: dict):
        return JsonType(d["name"], JsonSchema_from_dict(d["schema"]))
