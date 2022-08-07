import os
from pydantic import BaseSettings

from app.library.ms import parse_ms

# https://pydantic-docs.helpmanual.io/usage/settings/


class Settings(BaseSettings):
    python_env: str = 'development'

    database_url: str = 'sqlite:///./database.db'
    database_debug: bool = False

    jwt_secret: str = 'secret'
    jwt_algorithm: str = 'HS256'
    jwt_expires_in: str = '1d'

    class Config:
        env_file = '.env'


settings = Settings()

python_env = settings.python_env

is_development = python_env == 'development'
is_production = python_env == 'production'
is_test = python_env == 'test'

database_url = settings.database_url
database_debug = settings.database_debug

jwt_secret = settings.jwt_secret
jwt_expires_in = parse_ms(settings.jwt_expires_in)
