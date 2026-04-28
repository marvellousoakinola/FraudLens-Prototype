from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.user import User
from app.core.security import create_access_token, get_password_hash, verify_password
import uuid

router = APIRouter()

# Request Models
class UserSignup(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Response Models
class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: Optional[str] = None

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class MessageResponse(BaseModel):
    message: str

@router.post("/signup", response_model=MessageResponse)
async def signup(user: UserSignup, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check for duplicate email
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    
    # Create new user
    new_user = User(
        id=str(uuid.uuid4()),
        email=user.email,
        password=get_password_hash(user.password),
        name=user.name
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User created successfully"}

@router.post("/login", response_model=AuthResponse)
async def login(user: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return JWT token"""
    # Find user by email
    found_user = db.query(User).filter(User.email == user.email).first()
    
    if not found_user or not verify_password(user.password, found_user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create JWT token
    access_token = create_access_token(data={"sub": found_user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": found_user.id,
            "email": found_user.email,
            "name": found_user.name or found_user.email.split("@")[0]
        }
    }
