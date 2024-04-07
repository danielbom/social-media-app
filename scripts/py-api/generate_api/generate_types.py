from .generate_types_python import generate_types_python
from .generate_types_typescript import generate_types_typescript


def get_generate_types(language: str):
    if language == "python":
        return generate_types_python
    elif language == "typescript":
        return generate_types_typescript
    elif language == "javascript":
        raise ValueError("Javascript doesn't support types generation")
    else:
        raise ValueError(f"Unknown language: {language}")
