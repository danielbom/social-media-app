from sqlalchemy import TIMESTAMP, Column, ForeignKey, Integer, String

from .database import Base

# https://stackoverflow.com/questions/183042/how-can-i-use-uuids-in-sqlalchemy
# TODO: Use UUIDs in the database


class Post(Base):
    __tablename__ = 'posts'
    id = Column(String, primary_key=True)
    content = Column(String, nullable=False)
    likes = Column(Integer, nullable=False)
    authorId = Column(
        String, ForeignKey('users.id', ondelete='CASCADE'), nullable=False
    )
    createdAt = Column(TIMESTAMP(timezone=True), nullable=False)
    updatedAt = Column(TIMESTAMP(timezone=True), nullable=False)
    deletedAt = Column(TIMESTAMP(timezone=True), nullable=True)


class Comment(Base):
    __tablename__ = 'comments'
    id = Column(String, primary_key=True)
    content = Column(String, nullable=False)
    likes = Column(Integer, nullable=False)
    authorId = Column(String, nullable=False)
    commentParentId = Column(
        String, ForeignKey('comments.id', ondelete='CASCADE'), nullable=True
    )
    postParentId = Column(
        String, ForeignKey('posts.id', ondelete='CASCADE'), nullable=True
    )
    createdAt = Column(TIMESTAMP(timezone=True), nullable=False)
    updatedAt = Column(TIMESTAMP(timezone=True), nullable=False)
    deletedAt = Column(TIMESTAMP(timezone=True), nullable=True)


class User(Base):
    __tablename__ = 'users'
    id = Column(String, primary_key=True)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    createdAt = Column(TIMESTAMP(timezone=True), nullable=False)
    updatedAt = Column(TIMESTAMP(timezone=True), nullable=False)
    deletedAt = Column(TIMESTAMP(timezone=True), nullable=True)
