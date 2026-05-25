# user.py
# This file defines what a User looks like in our database
# Think of this class as a blueprint for every user that signs up

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

# This class maps directly to a "users" table in our PostgreSQL database
# Every attribute below becomes a column in that table
class User(Base):
    __tablename__ = "users"  # name of the table in the database

    # Each user gets a unique ID automatically
    id = Column(Integer, primary_key=True, index=True)
    
    # The user's display name (e.g. "Joseph Kahan")
    display_name = Column(String, nullable=False)
    
    # Email must be unique — no two users can share an email
    email = Column(String, unique=True, nullable=False, index=True)
    
    # We never store plain passwords — always store hashed versions
    hashed_password = Column(String, nullable=False)
    
    # Automatically set to the time the user signed up
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # This links a user to all their posts
    # If you have a User object, user.posts gives you all their posts
    posts = relationship("Post", back_populates="author")