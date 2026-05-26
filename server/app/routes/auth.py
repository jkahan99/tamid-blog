# auth.py
# These are the endpoints for registering and logging in
# POST /auth/register — create a new account
# POST /auth/login — sign in and get a token

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse
from passlib.context import CryptContext
from jose import jwt
import os

# This handles password hashing — never store plain passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Secret key for signing JWT tokens
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"

router = APIRouter()

# Register a new user
@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash the password before saving
    hashed = pwd_context.hash(user.password)
    
    # Create the new user object
    new_user = User(
        display_name=user.display_name,
        email=user.email,
        hashed_password=hashed
    )
    
    # Save to database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Login and get a JWT token
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    # Find the user by email
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    # Check if password matches
    if not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    # Create a JWT token so they stay logged in
    token = jwt.encode(
        {"sub": str(db_user.id), "email": db_user.email},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    
    return {"access_token": token, "token_type": "bearer"}