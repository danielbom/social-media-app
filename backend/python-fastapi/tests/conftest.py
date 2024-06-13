import asyncio

import server.controllers.users_controller as users
from server.dto.users_dto import UserCreateBody
from server.repositories.user_repository import get_user_repository
from server.services.crypt_service import get_crypt_service
from server.services.users_service import get_users_service
from tests.database import Session, database, engine
from tests.tables import metadata

# https://stackoverflow.com/questions/17801300/how-to-run-a-method-before-all-tests-in-all-classes


async def create_admin():
    async with database.connection() as _:
        user_repository = get_user_repository(database)
        crypt_service = get_crypt_service()
        users_service = get_users_service(crypt_service, user_repository)
        await users.users_store(
            UserCreateBody(username='admin', password='admin', role='admin'),
            users_service
        )


def pytest_sessionstart():
    session = Session()
    metadata.drop_all(bind=engine)
    metadata.create_all(bind=engine)
    asyncio.run(create_admin())
    session.close()


def pytest_sessionfinish(session, exitstatus):
    metadata.drop_all(bind=engine)
