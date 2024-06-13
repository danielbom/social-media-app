from typing import AsyncIterator

from databases.core import Connection, Database

from .env import env

DATABASE_URL = env.database_url
DATABASE_DEBUG = env.database_debug

database = Database(
    DATABASE_URL,
    echo=DATABASE_DEBUG,
    min_size=5,
    max_size=20)


async def get_database() -> AsyncIterator[Connection]:
    if not database.is_connected:
        await database.connect()
    async with database.connection() as connection:
        yield connection
