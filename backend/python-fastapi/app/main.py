import re

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.routing import Route

from app.logging import setup_logging

from .routers import auth, comments, posts, users

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

setup_logging()

# https://python.plainenglish.io/3-ways-to-handle-errors-in-fastapi-that-you-need-to-know-e1199e833039
# TODO: Add error handling to all endpoints


@app.get('/', tags=['Health'])
def read_root() -> str:
    return 'Healthy!'


app.include_router(auth.router)
app.include_router(comments.router)
app.include_router(posts.router)
app.include_router(users.router)


# case insensitive to match the url
# https://github.com/tiangolo/fastapi/issues/826
for route in app.router.routes:
    if isinstance(route, Route):
        route.path_regex = re.compile(route.path_regex.pattern, re.IGNORECASE)
