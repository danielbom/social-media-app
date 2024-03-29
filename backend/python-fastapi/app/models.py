from sqlalchemy import TIMESTAMP, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base

# https://stackoverflow.com/questions/183042/how-can-i-use-uuids-in-sqlalchemy
# TODO: Use UUIDs in the database


class Post(Base):
    __tablename__ = 'posts'
    id = Column(String, primary_key=True)
    content = Column(String, nullable=False)
    author_id = Column(
        String, ForeignKey('users.id', ondelete='CASCADE'), nullable=False
    )
    created_at = Column(TIMESTAMP(timezone=True), nullable=False)
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False)
    deleted_at = Column(TIMESTAMP(timezone=True), nullable=True)

    author = relationship('User')


class Comment(Base):
    __tablename__ = 'comments'
    id = Column(String, primary_key=True)
    content = Column(String, nullable=False)
    likes = Column(Integer, nullable=False)
    author_id = Column(
        String, ForeignKey('users.id', ondelete='CASCADE'), nullable=False
    )
    comment_parent_id = Column(
        String, ForeignKey('comments.id', ondelete='CASCADE'), nullable=True
    )
    post_parent_id = Column(
        String, ForeignKey('posts.id', ondelete='CASCADE'), nullable=True
    )
    created_at = Column(TIMESTAMP(timezone=True), nullable=False)
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False)
    deleted_at = Column(TIMESTAMP(timezone=True), nullable=True)

    author = relationship('User')


class User(Base):
    __tablename__ = 'users'
    id = Column(String, primary_key=True)
    username = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False)
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False)
    deleted_at = Column(TIMESTAMP(timezone=True), nullable=True)


class PostLike(Base):
    __tablename__ = 'post_likes'
    post_id = Column(
        String, ForeignKey('posts.id', ondelete='CASCADE'), primary_key=True
    )
    user_id = Column(
        String, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True
    )

    post = relationship('Post')
    user = relationship('User')
