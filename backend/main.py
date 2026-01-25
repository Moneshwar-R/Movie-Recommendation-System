from fastapi import FastAPI
from backend.routes import auth, recommend, user

app = FastAPI(title="Hybrid Movie Recommender API")

app.include_router(auth.router)
app.include_router(recommend.router)
app.include_router(user.router)

@app.get("/")
def root():
    return {"status": "Backend running"}
