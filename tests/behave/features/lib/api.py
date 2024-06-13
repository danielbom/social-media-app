# fmt: off
import timeit
from typing import TypedDict

import requests


class AuthLoginDto(TypedDict):
    username: str
    password: str


class AuthRegisterDto(TypedDict):
    username: str
    password: str


class CreateUserDto(TypedDict):
    username: str
    password: str
    role: str


class UpdateUserDto(TypedDict):
    username: str
    password: str


class CreateCommentDto(TypedDict):
    content: str
    postId: str


class CreateCommentAnswerDto(TypedDict):
    content: str
    commentId: str


class UpdateCommentDto(TypedDict):
    content: str


class CreatePostDto(TypedDict):
    content: str


class UpdatePostDto(TypedDict):
    content: str


class Config:
    base_url: str
    headers: dict[str, str]

    def __init__(self, base_url: str = '', headers: dict[str, str] = None):
        self.base_url = base_url
        self.headers = headers or {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "behave-api-client/0.1.0",
        }


class AppEndpoint:
    def __init__(self, config: Config) -> None:
        self._config = config

    def health_check(self):
        return requests.get(f"{self._config.base_url}/", headers=self._config.headers)


class AuthEndpoint:
    def __init__(self, config: Config) -> None:
        self._config = config

    def login(self, data: AuthLoginDto):
        return requests.post(f"{self._config.base_url}/auth/login", json=data, headers=self._config.headers)

    def register(self, data: AuthRegisterDto):
        return requests.post(f"{self._config.base_url}/auth/register", json=data, headers=self._config.headers)

    def me(self):
        return requests.get(f"{self._config.base_url}/auth/me", headers=self._config.headers)


class UsersEndpoint:
    def __init__(self, config: Config) -> None:
        self._config = config

    def create(self, data: CreateUserDto):
        return requests.post(f"{self._config.base_url}/users", json=data, headers=self._config.headers)

    def find_all(self):
        return requests.get(f"{self._config.base_url}/users", headers=self._config.headers)

    def find_one(self, id: str):
        return requests.get(f"{self._config.base_url}/users/{id}", headers=self._config.headers)

    def update(self, id: str, data: UpdateUserDto):
        return requests.patch(f"{self._config.base_url}/users/{id}", json=data, headers=self._config.headers)

    def remove(self, id: str):
        return requests.delete(f"{self._config.base_url}/users/{id}", headers=self._config.headers)


class CommentsEndpoint:
    def __init__(self, config: Config) -> None:
        self._config = config

    def create(self, data: CreateCommentDto):
        return requests.post(f"{self._config.base_url}/comments", json=data, headers=self._config.headers)

    def find_all(self):
        return requests.get(f"{self._config.base_url}/comments", headers=self._config.headers)

    def create_answer(self, data: CreateCommentAnswerDto):
        return requests.post(f"{self._config.base_url}/comments/answers", json=data, headers=self._config.headers)

    def find_one(self, id: str):
        return requests.get(f"{self._config.base_url}/comments/{id}", headers=self._config.headers)

    def update(self, id: str, data: UpdateCommentDto):
        return requests.patch(f"{self._config.base_url}/comments/{id}", json=data, headers=self._config.headers)

    def remove(self, id: str):
        return requests.delete(f"{self._config.base_url}/comments/{id}", headers=self._config.headers)


class PostsEndpoint:
    def __init__(self, config: Config) -> None:
        self._config = config

    def create(self, data: CreatePostDto):
        return requests.post(f"{self._config.base_url}/posts", json=data, headers=self._config.headers)

    def find_all(self):
        return requests.get(f"{self._config.base_url}/posts", headers=self._config.headers)

    def find_one(self, id: str):
        return requests.get(f"{self._config.base_url}/posts/{id}", headers=self._config.headers)

    def update(self, id: str, data: UpdatePostDto):
        return requests.patch(f"{self._config.base_url}/posts/{id}", json=data, headers=self._config.headers)

    def remove(self, id: str):
        return requests.delete(f"{self._config.base_url}/posts/{id}", headers=self._config.headers)


class TestsEndpoint:
    def __init__(self, config: Config) -> None:
        self._config = config
    
    def tear_up(self):
        return requests.post(f"{self._config.base_url}/tests/tear-up", headers=self._config.headers)
    
    def tear_down(self):
        return requests.post(f"{self._config.base_url}/tests/tear-down", headers=self._config.headers)


class Api:
    def __init__(self, base_url: str):
        self._config = Config(base_url)
        self.app = AppEndpoint(self._config)
        self.auth = AuthEndpoint(self._config)
        self.users = UsersEndpoint(self._config)
        self.comments = CommentsEndpoint(self._config)
        self.posts = PostsEndpoint(self._config)
        self.tests = TestsEndpoint(self._config)


def timer(endpoint, func):
    return func
    cls_name = endpoint.__name__
    func_name = func.__name__
    def wrapper(self, *args, **kwargs):
        start = timeit.default_timer()
        result = func(self, *args, **kwargs)
        end = timeit.default_timer()
        print(f"{cls_name}.{func_name}() -> {result} ({end - start}s)")
        return result
    return wrapper


for endpoint in list(locals().values()):
    if getattr(endpoint, '__name__', '').endswith('Endpoint'):
        for method in dir(endpoint):
            if method.startswith('_'):
                continue
            attr = getattr(endpoint, method)
            if callable(attr):
                setattr(endpoint, method, timer(endpoint, attr))

