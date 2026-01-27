from fastapi import APIRouter
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))
from src.hybrid import recommend_hybrid
import pandas as pd

router = APIRouter(prefix="/recommend")

# load once
movies_df = pd.read_csv(os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'final_movies_extended.csv'))

@router.get("/all")
def get_all_movies():
    return movies_df["title"].tolist()

@router.get("/{movie}")
def get_recommendations(movie: str):
    return {"recommendations": recommend_hybrid(movie)}
