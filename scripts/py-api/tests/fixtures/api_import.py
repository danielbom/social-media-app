from dataclasses import dataclass
import requests
from .types import PostsCreateBody, PostsUpdateBody, CommentsCreateBody, CommentsUpdateBody


@dataclass
class Config:
    base_url: str


class PostsEndpoint:
    def __init__(self, config: Config) -> None:
        self.config = config

    def get_all(self):
        return requests.get(f"{self.config.base_url}/posts")

    def get_by_id(self, id):
        return requests.get(f"{self.config.base_url}/posts/{id}")

    def create(self, data: PostsCreateBody):
        return requests.post(f"{self.config.base_url}/posts", json=data)

    def update(self, id, data: PostsUpdateBody):
        return requests.put(f"{self.config.base_url}/posts/{id}", json=data)

    def delete(self, id):
        return requests.delete(f"{self.config.base_url}/posts/{id}")


class CommentsEndpoint:
    def __init__(self, config: Config) -> None:
        self.config = config

    def get_all(self):
        return requests.get(f"{self.config.base_url}/comments")

    def get_by_id(self, id: str):
        return requests.get(f"{self.config.base_url}/comments/{id}")

    def create(self, data: CommentsCreateBody):
        return requests.post(f"{self.config.base_url}/comments", json=data)

    def update(self, id: str, data: CommentsUpdateBody):
        return requests.put(f"{self.config.base_url}/comments/{id}", json=data)

    def delete(self, id: str):
        return requests.delete(f"{self.config.base_url}/comments/{id}")


class Api:
    def __init__(self, base_url: str):
        self.config = Config(base_url)
        self.posts = PostsEndpoint(self.config)
        self.comments = CommentsEndpoint(self.config)
