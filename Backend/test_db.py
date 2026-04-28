import os
from dotenv import load_dotenv
from sqlalchemy import text
from app.db.database import engine, Base

# Load environment variables
load_dotenv()

# Test database connection
try:
    print(f"Testing connection with DATABASE_URL: {os.getenv('DATABASE_URL', 'Not set')}")
    
    # Test connection
    with engine.connect() as connection:
        result = connection.execute(text("SELECT version()"))
        print(f"✅ Database connected successfully!")
        print(f"PostgreSQL version: {result.fetchone()[0]}")
        
    # Create tables
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
    
except Exception as e:
    print(f"❌ Database connection failed: {e}")
    print(f"Please check your DATABASE_URL environment variable")
