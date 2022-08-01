from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = 'sqlite:///./database.db'

Base = declarative_base()
engine = create_engine(DATABASE_URL, echo=True)
Session = sessionmaker(bind=engine, autocommit=False, autoflush=False)


def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()
