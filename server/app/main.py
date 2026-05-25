# main.py
# This is the entry point of our FastAPI application
# Think of this as the "front door" of our backend server
# When we start the server, this file runs first

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create the FastAPI app
app = FastAPI(
    title="TAMID Blog API",
    description="Backend API for the TAMID Blog project",
    version="1.0.0"
)

# CORS middleware allows our React frontend to talk to our FastAPI backend
# Without this, the browser would block requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple test endpoint
# Visit http://localhost:8000 to see if the server is running
@app.get("/")
def root():
    return {"message": "TAMID Blog API is running!"}