from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

app.include_router(auth.router)
app.include_router(recommend.router)
app.include_router(user.router)

@app.get("/")
def root():
    return {"status": "Backend running"}