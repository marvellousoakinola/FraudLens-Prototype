import os
from dotenv import load_dotenv
from sqlalchemy import text
from app.db.database import engine

load_dotenv()

def check_columns():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='users';"))
        columns = [row[0] for row in result.fetchall()]
        print(f"Columns in 'users' table: {columns}")

if __name__ == "__main__":
    check_columns()
