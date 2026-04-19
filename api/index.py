from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import sys

# Add current directory to path for Vercel
sys.path.append(os.path.dirname(__file__))
from simulation import simulate_crowd_data

# Initialize FastAPI app
app = FastAPI(
    title="SafeExit AI Backend",
    description="API for real-time crowd density monitoring and risk assessment.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api")
@app.get("/")
async def root():
    """Welcome endpoint for the API."""
    return {
        "status": "online",
        "message": "Welcome to SafeExit AI API.",
        "environment": "Vercel Serverless"
    }

@app.get("/api/crowd-data")
@app.get("/crowd-data")
async def get_crowd_data():
    """
    Fetch real-time (simulated) crowd density data for all zones.
    Returns:
        List of objects containing zone id, people count, capacity, and risk level.
    """
    data = simulate_crowd_data()
    return data

if __name__ == "__main__":
    import uvicorn
    # Start the server locally on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
