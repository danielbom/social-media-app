import re

from fastapi import FastAPI
from starlette.routing import Route

from .database import engine
from .models import Base
from .routers import auth, comments, posts, users

Base.metadata.create_all(bind=engine)

app = FastAPI()

# https://python.plainenglish.io/3-ways-to-handle-errors-in-fastapi-that-you-need-to-know-e1199e833039
# TODO: Add error handling to all endpoints


@app.get('/', tags=['Health'])
def read_root():
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
