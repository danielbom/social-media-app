import logging

from passlib.context import CryptContext

crypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

logging.getLogger('passlib').setLevel(logging.ERROR)


class CryptService:
    def hash_password(self, password: str) -> str:
        return crypt_context.hash(password)

    def check_password(self, password: str, hashed_password: str) -> bool:
        return crypt_context.verify(password, hashed_password)


def get_crypt_service() -> CryptService:
    return CryptService()
