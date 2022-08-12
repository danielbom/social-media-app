"""add admin

Revision ID: 26bdc2b0f5ee
Revises: 38f9c4c80cf4
Create Date: 2022-08-11 21:58:44.845476
"""
from datetime import datetime

from app import env
from app.database import get_db
from app.models import User
from app.services import crypt

# revision identifiers, used by Alembic.
revision = '26bdc2b0f5ee'
down_revision = '38f9c4c80cf4'
branch_labels = None
depends_on = None


def upgrade() -> None:
    for db in get_db():
        password = crypt.hash_password(env.app_admin_password)
        admin_user = User(
            id=env.app_admin_id,
            username='admin',
            password=password,
            role='admin',
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )
        db.add(admin_user)
        db.commit()


def downgrade() -> None:
    for db in get_db():
        db.query(User).filter(User.id == env.app_admin_id).delete()
