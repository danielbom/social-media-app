import _prepare_script

from app import models, schemas
from app.database import get_db
from app.routers import users

print('[INFO] Creating user admin')

db = next(get_db())

admin_user = (
    db.query(models.User).where(models.User.username == 'admin').first()
)

if admin_user is not None:
    print('[ERROR] User admin already exists')
    exit(1)

users.create_user(
    body=schemas.CreateUser(
        username='admin',
        password='admin',
        role='admin',
    ),
    db=db,
)

db.close()

print('[INFO] User admin created')
