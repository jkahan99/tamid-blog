# database.py
# This file creates the connection between our FastAPI app and our PostgreSQL database on AWS RDS
# Think of this as the "bridge" between our code and where data is stored

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables from our .env file
# This keeps sensitive info like passwords out of our code
load_dotenv()

# Get the database URL from our .env file
# It will look like: postgresql://username:password@host:port/dbname
DATABASE_URL = os.getenv("DATABASE_URL")

# Create the engine — this is the actual connection to the database
engine = create_engine(DATABASE_URL)

# SessionLocal is what we use to talk to the database in each request
# Each API request gets its own session, then closes it when done
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base is what all our models (User, Post, Tag) will inherit from
# It's what links our Python classes to actual database tables
Base = declarative_base()

# This function gives each API request its own database session
# It automatically closes the session when the request is done
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()