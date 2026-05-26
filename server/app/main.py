from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, posts

# Create all database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TAMID Blog API",
    description="Backend API for the TAMID Blog project",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(posts.router, prefix="/posts", tags=["posts"])

@app.get("/")
def root():
    return {"message": "TAMID Blog API is running!"}