from typing import Any, Generator, Type

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

from . import env

__all__ = ['Base', 'get_db', 'Session']


Base = declarative_base()
engine = create_engine(env.database_url, echo=env.database_debug)
SessionMaker = sessionmaker(bind=engine, autocommit=False, autoflush=False)


def get_db() -> Generator[Session, None, None]:
    db = SessionMaker()
    try:
        yield db
    finally:
        db.close()
