# post.py
# This file defines what a Blog Post looks like in our database
# Every blog post belongs to a User (the author)

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

# This class maps to a "posts" table in our PostgreSQL database
class Post(Base):
    __tablename__ = "posts"

    # Unique ID for each post
    id = Column(Integer, primary_key=True, index=True)

    # Title of the blog post
    title = Column(String, nullable=False)

    # The actual blog content — Text allows very long strings
    content = Column(Text, nullable=False)

    # True = anyone can see it, False = only the author can see it
    is_public = Column(Boolean, default=True)

    # Optional image URL for photo attachments stored in AWS S3
    image_url = Column(String, nullable=True)

    # When the post was created and last updated
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # This links the post to its author
    # ForeignKey means this must match an id in the users table
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # This gives us access to the full User object from a Post
    # e.g. post.author.display_name gives us the author's name
    author = relationship("User", back_populates="posts")

    # This links the post to its tags
    tags = relationship("Tag", secondary="post_tags", back_populates="posts")