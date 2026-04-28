from sqlalchemy import Column, String
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    name = Column(String, nullable=True)
    avatar = Column(String, nullable=True)
