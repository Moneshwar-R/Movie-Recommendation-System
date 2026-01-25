from fastapi import APIRouter
from src.hybrid import recommend_hybrid

router = APIRouter(prefix="/recommend")

@router.get("/{movie}")
def get_recommendations(movie: str):
    return {"recommendations": recommend_hybrid(movie)}
