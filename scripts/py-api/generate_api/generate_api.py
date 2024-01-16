from generate_api.commons import Endpoint, ExternalTypeAction
from .generate_directory_api_typescript import generate_directory_api_typescript
from .generate_api_javascript import generate_api_javascript
from .generate_api_python import generate_api_python
from .generate_api_typescript import generate_api_typescript


def get_generate_api(language: str):
    if language == "python":
        return generate_api_python
    elif language == "javascript":
        return generate_api_javascript
    elif language == "typescript":
        return generate_api_typescript
    else:
        raise ValueError(f"Unknown language: {language}")


def get_generate_directory_api(language: str):
    if language == "python":
        # return generate_directory_api_python
        raise NotImplementedError()
    elif language == "javascript":
        # return generate_directory_api_javascript
        raise NotImplementedError()
    elif language == "typescript":
        return generate_directory_api_typescript
    else:
        raise ValueError(f"Unknown language: {language}")
