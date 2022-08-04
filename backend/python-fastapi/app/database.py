from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from . import env

Base = declarative_base()
engine = create_engine(env.database_url, echo=env.database_debug)
Session = sessionmaker(bind=engine, autocommit=False, autoflush=False)


def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()
