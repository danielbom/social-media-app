import re
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from prometheus_fastapi_instrumentator import Instrumentator

import server.controllers.auth_controller as auth
import server.controllers.comments_controller as comments
import server.controllers.posts_controller as posts
import server.controllers.tests_controller as tests
import server.controllers.users_controller as users
import server.errors
import server.logging
from server.env import env


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    from server.database import database

    async with database as _:
        yield


app = FastAPI(
    lifespan=lifespan,
    title="Social Media API",
    description="API for the Social Media project",
    version="0.1.0",
    docs_url="/swagger",
    openapi_url="/swagger/openapi.json",
)
server.errors.configure(app)
server.logging.configure()

app.add_middleware(
    CORSMiddleware,
    allow_origins=env.cors,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get("/", tags=["Root"])
def root_index_to_docs():
    return RedirectResponse(url="/swagger")


@app.get('/health', tags=['Root'])
def root_health() -> str:
    return 'Healthy!'


app.include_router(auth.router)
app.include_router(comments.router)
app.include_router(users.router)
app.include_router(posts.router)
app.include_router(tests.router)

# Access the monitor at http://localhost:8000/monitor
Instrumentator().instrument(app).expose(app, tags=["Prometheus"])

if env.case_insensitive:
    # fmt: off
    # case insensitive to match the url
    # https://github.com/tiangolo/fastapi/issues/826
    for route in app.router.routes:
        if getattr(route, 'path_regex', None):
            route.path_regex = re.compile(route.path_regex.pattern, re.IGNORECASE) # type: ignore
    # fmt: on
