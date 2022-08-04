import os

from app.library.ms import parse_ms

python_env = os.environ.get('PYTHON_ENV', 'development')

is_development = python_env == 'development'
is_production = python_env == 'production'
is_test = python_env == 'test'

database_url = os.environ.get('DATABASE_URL', 'sqlite:///./database.db')
database_debug = os.environ.get('DATABASE_DEBUG', 'False') == 'True'

jwt_secret = os.environ.get('JWT_SECRET', 'secret')
jwt_expires_in = parse_ms(os.environ.get('JWT_EXPIRES_IN', '1d'))
