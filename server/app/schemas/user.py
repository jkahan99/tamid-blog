# schemas/user.py
# Schemas define what data is allowed IN and OUT of our API
# Think of them as the "shape" of data we accept and return
# Pydantic automatically validates the data for us

from pydantic import BaseModel, EmailStr
from datetime import datetime

# What we need when someone REGISTERS
class UserCreate(BaseModel):
    display_name: str
    email: str
    password: str  # plain password, we'll hash it before saving

# What we return when someone asks for a user
# Notice we never return the password!
class UserResponse(BaseModel):
    id: int
    display_name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True  # lets us convert SQLAlchemy objects to this schema

# What we need when someone LOGS IN
class UserLogin(BaseModel):
    email: str
    password: str