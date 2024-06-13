from sqlalchemy import Column, Integer, MetaData, String, Table

metadata = MetaData()

Uuid = String(36)

user = Table(
    "user",
    metadata,
    Column("id", Uuid, primary_key=True),
    Column("username", String(256)),
    Column("password", String(256)),
    Column("role", String(32)),
    Column('version', Integer, nullable=False),
)

post = Table(
    "post",
    metadata,
    Column("id", Uuid, primary_key=True),
    Column("content", String(256)),
    Column("likes", Integer, nullable=False),
    Column("author_id", Uuid),
    Column("created_at", String(32)),
    Column("updated_at", String(32)),
    Column("deleted_at", String(32)),
)

comment = Table(
    "comment",
    metadata,
    Column("id", Uuid, primary_key=True),
    Column("content", String(256)),
    Column("likes", Integer),
    Column("author_id", Uuid),
    Column("post_parent_id", Uuid),
    Column("comment_parent_id", Uuid),
    Column("created_at", String(32)),
    Column("updated_at", String(32)),
    Column("deleted_at", String(32)),
)
