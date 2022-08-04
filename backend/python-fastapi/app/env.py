import os

from app.library.ms import parse_ms

database_url = os.environ.get('DATABASE_URL', 'sqlite:///./database.db')

jwt_secret = os.environ.get('JWT_SECRET', 'secret')
jwt_expires_in = parse_ms(os.environ.get('JWT_EXPIRES_IN', '1d'))
