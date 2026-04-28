import asyncio
from app.services.scan import analyze_payload

async def test_ai():
    try:
        print("Testing AI engine...")
        result = await analyze_payload("Visit http://fake-bank.com login page urgent action required")
        print("✅ AI engine working!")
        print(f"Result: {result}")
    except Exception as e:
        print(f"❌ AI engine failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_ai())
