from pydantic import BaseSettings

from app.library.ms import parse_ms

# https://pydantic-docs.helpmanual.io/usage/settings/


class Settings(BaseSettings):
    python_env: str = 'development'

    app_admin_id: str = 'c3437ac2-1fb0-4a5a-8930-63c9582bb10f'
    app_admin_password: str = 'admin'

    database_url: str = 'sqlite:///./database.db'
    database_debug: bool = False

    jwt_secret: str = 'secret'
    jwt_algorithm: str = 'HS256'
    jwt_expires_in: str = '1d'

    log_level: str = 'INFO'
    log_json: bool = False

    class Config:
        env_file = '.env'


settings = Settings()

python_env = settings.python_env

is_development = python_env == 'development'
is_production = python_env == 'production'
is_test = python_env == 'test'

app_admin_id = settings.app_admin_id
app_admin_password = settings.app_admin_password

database_url = settings.database_url
database_debug = settings.database_debug

jwt_secret = settings.jwt_secret
jwt_expires_in = parse_ms(settings.jwt_expires_in)

log_json = settings.log_json
log_level = settings.log_level
