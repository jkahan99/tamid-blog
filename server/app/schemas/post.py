# schemas/post.py
# These schemas define what data is allowed IN and OUT of our posts API
# Every time someone creates or views a post, data is validated against these

from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# What we need when someone CREATES a post
class PostCreate(BaseModel):
    title: str
    content: str
    is_public: bool = True  # defaults to public
    tags: List[str] = []    # list of tag names e.g. ["Tech", "Finance"]
    image_url: Optional[str] = None  # optional photo

# What we need when someone UPDATES a post
class PostUpdate(BaseModel):
    title: Optional[str] = None      # optional — only update what's provided
    content: Optional[str] = None
    is_public: Optional[bool] = None
    tags: Optional[List[str]] = None
    image_url: Optional[str] = None

# What we return when someone asks for a post
class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    is_public: bool
    image_url: Optional[str]
    created_at: datetime
    updated_at: datetime
    author_id: int
    author_name: str
    tags: List[str] = []

    class Config:
        from_attributes = True  # lets us convert SQLAlchemy objects to this schema