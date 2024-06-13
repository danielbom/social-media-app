from typing import AsyncIterator

import pytest
from databases.core import Connection, Database
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from server.database import get_database
from server.main import app

DATABASE_URL = 'sqlite:///./tmp/test.db'

database = Database(DATABASE_URL)
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)


async def test_get_database() -> AsyncIterator[Connection]:
    if not database.is_connected:
        await database.connect()
    async with database.connection() as connection:
        yield connection


@pytest.fixture
def client():
    app.dependency_overrides[get_database] = test_get_database

    with TestClient(app) as test_client:
        yield test_client
