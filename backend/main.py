from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from .routes import auth, recommend, user

app = FastAPI(title="Hybrid Movie Recommender API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



posters_dir = os.path.join(os.path.dirname(__file__), '..', 'data', 'poster_downloads')
if os.path.exists(posters_dir):
    app.mount("/posters", StaticFiles(directory=posters_dir), name="posters")
else:
    print(f"Warning: Posters directory not found at {posters_dir}")

app.include_router(auth.router)
app.include_router(recommend.router)
app.include_router(user.router)

@app.get("/")
def root():
    return {"status": "Backend running"}