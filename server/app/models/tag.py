# tag.py
# This file defines what a Tag looks like in our database
# Tags are labels users can attach to posts (e.g. "Tech", "Finance", "Sports")

from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.database import Base

# This is a "junction table" — it connects posts and tags together
# A post can have many tags, a tag can belong to many posts
# This table just stores pairs of (post_id, tag_id)
post_tags = Table(
    "post_tags",
    Base.metadata,
    Column("post_id", Integer, ForeignKey("posts.id"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id"), primary_key=True)
)

# This class maps to a "tags" table in our PostgreSQL database
class Tag(Base):
    __tablename__ = "tags"

    # Unique ID for each tag
    id = Column(Integer, primary_key=True, index=True)

    # The tag name e.g. "Technology", "Finance", "Sports"
    # Must be unique — no duplicate tag names
    name = Column(String, unique=True, nullable=False)

    # This gives us all posts that have this tag
    # e.g. tag.posts gives us every post tagged with "Technology"
    posts = relationship("Post", secondary="post_tags", back_populates="tags")