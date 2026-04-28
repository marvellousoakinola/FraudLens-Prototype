from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, scan, stats, user, intel, logs, reports
from app.db.database import Base, engine
from sqlalchemy import text

# Create database tables
Base.metadata.create_all(bind=engine)

# Fix schema (add missing columns if they don't exist)
def fix_schema():
    print("Checking database schema...")
    try:
        with engine.connect() as connection:
            # Check for 'name' and 'avatar' columns
            for column_name in ["name", "avatar"]:
                try:
                    res = connection.execute(text(f"SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name='{column_name}'"))
                    if not res.fetchone():
                        print(f"Adding missing column '{column_name}' to 'users' table...")
                        connection.execute(text(f"ALTER TABLE users ADD COLUMN {column_name} VARCHAR"))
                        connection.execute(text("COMMIT"))
                        print(f"✅ Added '{column_name}' column.")
                except Exception as col_e:
                    print(f"⚠️ Could not add column {column_name}: {col_e}")
                    connection.execute(text("ROLLBACK"))
    except Exception as e:
        print(f"❌ Error during schema migration: {e}")

fix_schema()

app = FastAPI(
    title="FraudLens API",
    description="Production-ready cybersecurity SaaS API",
    version="1.0.0"
)

# CORS middleware (allow all origins for now)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(scan.router, prefix="/scan", tags=["Scan"])
app.include_router(stats.router, prefix="/stats", tags=["Stats"])
app.include_router(user.router, prefix="/user", tags=["User"])
app.include_router(intel.router, prefix="/intel", tags=["Intel"])
app.include_router(logs.router, prefix="/logs", tags=["Logs"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])

@app.get("/")
def root():
    return {"message": "FraudLens API running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)