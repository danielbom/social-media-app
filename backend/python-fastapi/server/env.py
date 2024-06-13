import os
from typing import List

import dotenv
from pydantic import BaseModel

from server.lib.ms import parse_ms


class Env(BaseModel):
    port: int
    cors: List[str]
    admin_password: str
    case_insensitive: bool

    database_engine: str
    database_url: str
    database_debug: bool

    jwt_secret: str
    jwt_expires_in: int
    jwt_refresh_expires_in: int


dotenv.load_dotenv()
# fmt: off
env = Env(
    port=int(os.environ.get("APP_PORT", 8000)),
    cors=os.environ.get("APP_CORS", "*").split(","),
    admin_password=os.environ.get("APP_ADMIN_PASSWORD", "admin"),
    case_insensitive=os.environ.get("APP_CASE_INSENSITIVE", "false").lower() == "true",

    jwt_secret=os.environ.get("JWT_SECRET", "secret"),
    jwt_expires_in=parse_ms(os.environ.get("JWT_EXPIRES_IN", "1h")),
    jwt_refresh_expires_in=parse_ms(os.environ.get("JWT_REFRESH_EXPIRES_IN", "24h")),

    database_engine=os.environ.get("DATABASE_ENGINE", "sqlite"),
    database_url=os.environ.get('DATABASE_URL', "sqlite+aiosqlite:///../database.db"),
    database_debug=os.environ.get("DATABASE_DEBUG", "false").lower() == "true",
)
# fmt: on
