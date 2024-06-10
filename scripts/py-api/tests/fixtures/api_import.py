import requests
from .types import PostsCreateBody, PostsUpdateBody, CommentsCreateBody, CommentsUpdateBody


class Config:
    base_url: str
    headers: dict[str, str]

    def __init__(self, base_url: str = '', headers: dict[str, str] = None):
        self.base_url = base_url
        self.headers = headers or {}


class PostsEndpoint:
    def __init__(self, config: Config) -> None:
        self._config = config

    def get_all(self):
        return requests.get(f"{self._config.base_url}/posts", headers=self._config.headers)

    def get_by_id(self, id):
        return requests.get(f"{self._config.base_url}/posts/{id}", headers=self._config.headers)

    def create(self, data: PostsCreateBody):
        return requests.post(f"{self._config.base_url}/posts", json=data, headers=self._config.headers)

    def update(self, id, data: PostsUpdateBody):
        return requests.put(f"{self._config.base_url}/posts/{id}", json=data, headers=self._config.headers)

    def delete(self, id):
        return requests.delete(f"{self._config.base_url}/posts/{id}", headers=self._config.headers)


class CommentsEndpoint:
    def __init__(self, config: Config) -> None:
        self._config = config

    def get_all(self):
        return requests.get(f"{self._config.base_url}/comments", headers=self._config.headers)

    def get_by_id(self, id: str):
        return requests.get(f"{self._config.base_url}/comments/{id}", headers=self._config.headers)

    def create(self, data: CommentsCreateBody):
        return requests.post(f"{self._config.base_url}/comments", json=data, headers=self._config.headers)

    def update(self, id: str, data: CommentsUpdateBody):
        return requests.put(f"{self._config.base_url}/comments/{id}", json=data, headers=self._config.headers)

    def delete(self, id: str):
        return requests.delete(f"{self._config.base_url}/comments/{id}", headers=self._config.headers)


class Api:
    def __init__(self, base_url: str):
        self._config = Config(base_url)
        self.posts = PostsEndpoint(self._config)
        self.comments = CommentsEndpoint(self._config)
