# posts.py
# These are the endpoints for blog posts
# GET /posts — get all public posts
# GET /posts/{id} — get one post
# POST /posts — create a post
# PUT /posts/{id} — update a post
# DELETE /posts/{id} — delete a post

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.post import Post
from app.models.tag import Tag
from app.models.user import User
from app.schemas.post import PostCreate, PostUpdate, PostResponse
from jose import jwt
from fastapi.security import OAuth2PasswordBearer
import os

SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Helper function to get the current logged in user from their token
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

# GET /posts — returns all public posts
# Anyone can see this, no login required
@router.get("/")
def get_posts(
    tag: str = None,
    author: str = None,
    title: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(Post).filter(Post.is_public == True)
    
    # Filter by author name if provided
    if author:
        query = query.join(User).filter(User.display_name.ilike(f"%{author}%"))
    
    # Filter by title if provided
    if title:
        query = query.filter(Post.title.ilike(f"%{title}%"))
    
    # Filter by tag if provided
    if tag:
        query = query.join(Post.tags).filter(Tag.name.ilike(f"%{tag}%"))
    
    posts = query.all()
    
    # Format the response
    result = []
    for post in posts:
        result.append({
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "is_public": post.is_public,
            "image_url": post.image_url,
            "created_at": post.created_at,
            "updated_at": post.updated_at,
            "author_id": post.author_id,
            "author_name": post.author.display_name,
            "tags": [tag.name for tag in post.tags]
        })
    return result

# GET /posts/{id} — get one specific post
@router.get("/{post_id}")
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if not post.is_public:
        raise HTTPException(status_code=403, detail="This post is private")
    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "is_public": post.is_public,
        "image_url": post.image_url,
        "created_at": post.created_at,
        "updated_at": post.updated_at,
        "author_id": post.author_id,
        "author_name": post.author.display_name,
        "tags": [tag.name for tag in post.tags]
    }

# POST /posts — create a new post (must be logged in)
@router.post("/")
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Handle tags — create them if they don't exist
    tag_objects = []
    for tag_name in post.tags:
        tag = db.query(Tag).filter(Tag.name == tag_name).first()
        if not tag:
            tag = Tag(name=tag_name)
            db.add(tag)
        tag_objects.append(tag)
    
    # Create the post
    new_post = Post(
        title=post.title,
        content=post.content,
        is_public=post.is_public,
        image_url=post.image_url,
        author_id=current_user.id,
        tags=tag_objects
    )
    
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    
    return {
        "id": new_post.id,
        "title": new_post.title,
        "content": new_post.content,
        "is_public": new_post.is_public,
        "author_name": current_user.display_name,
        "tags": [tag.name for tag in new_post.tags]
    }

# PUT /posts/{id} — update a post (must be the author)
@router.put("/{post_id}")
def update_post(
    post_id: int,
    post_update: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only edit your own posts")
    
    # Only update fields that were provided
    if post_update.title is not None:
        post.title = post_update.title
    if post_update.content is not None:
        post.content = post_update.content
    if post_update.is_public is not None:
        post.is_public = post_update.is_public
    if post_update.image_url is not None:
        post.image_url = post_update.image_url
    if post_update.tags is not None:
        tag_objects = []
        for tag_name in post_update.tags:
            tag = db.query(Tag).filter(Tag.name == tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.add(tag)
            tag_objects.append(tag)
        post.tags = tag_objects
    
    db.commit()
    db.refresh(post)
    return {"message": "Post updated successfully"}

# DELETE /posts/{id} — delete a post (must be the author)
@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own posts")
    
    db.delete(post)
    db.commit()
    return {"message": "Post deleted successfully"}