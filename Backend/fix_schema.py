import os
from dotenv import load_dotenv
from sqlalchemy import text
from app.db.database import engine

# Load environment variables
load_dotenv()

def fix_schema():
    print("Checking database schema...")
    try:
        with engine.connect() as connection:
            # Check if name column exists
            result = connection.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='users' AND column_name='name';
            """))
            if not result.fetchone():
                print("Adding 'name' column to 'users' table...")
                connection.execute(text("ALTER TABLE users ADD COLUMN name VARCHAR;"))
                connection.commit()
                print("✅ 'name' column added.")
            else:
                print("✅ 'name' column already exists.")

            # Check if avatar column exists
            result = connection.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='users' AND column_name='avatar';
            """))
            if not result.fetchone():
                print("Adding 'avatar' column to 'users' table...")
                connection.execute(text("ALTER TABLE users ADD COLUMN avatar VARCHAR;"))
                connection.commit()
                print("✅ 'avatar' column added.")
            else:
                print("✅ 'avatar' column already exists.")
            
            print("Schema fix completed successfully!")
    except Exception as e:
        print(f"❌ Error fixing schema: {e}")

if __name__ == "__main__":
    fix_schema()
