from app import routers, schemas
from app.database import Base

from .database import TestSession, engine

# https://stackoverflow.com/questions/17801300/how-to-run-a-method-before-all-tests-in-all-classes


def create_admin(session):
    routers.users.create_user(
        schemas.CreateUser(username='admin', password='admin', role='admin'),
        session,
    )


def pytest_sessionstart(session):
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = TestSession()
    create_admin(db)
    db.close()


def pytest_sessionfinish(session, exitstatus):
    Base.metadata.drop_all(bind=engine)
