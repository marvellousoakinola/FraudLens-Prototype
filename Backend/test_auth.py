import asyncio
import uuid
from app.core.security import create_access_token
from app.core.deps import get_current_user
from app.db.deps import SessionLocal
from app.models.user import User
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

async def test_auth():
    try:
        # Use existing test user
        db = SessionLocal()
        user = db.query(User).filter(User.email == 'test@example.com').first()
        
        if not user:
            # Create test user if doesn't exist
            user = User(
                id=str(uuid.uuid4()),
                email='test@example.com',
                password='hashed_password'
            )
            db.add(user)
            db.commit()
            print(f'✅ Created test user: {user.id}')
        else:
            print(f'✅ Using existing test user: {user.id}')
        
        # Generate JWT token
        token = create_access_token({'sub': user.id})
        print(f'✅ Generated JWT token: {token[:50]}...')
        
        # Test get_current_user function
        credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
        current_user = get_current_user(credentials, db)
        print(f'✅ get_current_user working: {current_user.email}')
        
        db.close()
        
    except Exception as e:
        print(f'❌ Auth test failed: {e}')
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_auth())
