from fastapi import APIRouter
import sys
import os
import pandas as pd
import glob

sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))
from src.hybrid import recommend_hybrid

router = APIRouter(prefix="/recommend")

# Load movies data
movies_df = pd.read_csv(os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'final_movies_extended.csv'))

# Create a mapping of movie_id -> poster_filename
poster_map = {}
posters_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'poster_downloads')

try:
    if os.path.exists(posters_dir):
        # Scan for all files in the directory
        for filename in os.listdir(posters_dir):
            if filename.endswith(('.jpg', '.jpeg', '.png')):
                # Expected format: 1.6_245943.jpg (where 245943 is the ID)
                parts = filename.split('_')
                if len(parts) > 1:
                    # The ID is the section after the first underscore, before the extension
                    # e.g. "1.6_245943.jpg" -> "245943.jpg" -> "245943"
                    try:
                        movie_id_str = parts[1].split('.')[0]
                        movie_id = int(movie_id_str)
                        poster_map[movie_id] = filename
                    except ValueError:
                        continue
    else:
        print(f"Warning: Posters directory not found at {posters_dir}")
except Exception as e:
    print(f"Error scanning posters directory: {e}")

def get_movie_poster_url(movie_id):
    """Helper to get the full poster URL for a movie ID."""
    if movie_id in poster_map:
        return f"http://localhost:8000/posters/{poster_map[movie_id]}"
    return None

@router.get("/all")
def get_all_movies():
    """
    Returns a list of all movies with their ID, title, and poster URL.
    """
    # Create a list of dictionaries
    movies_list = []
    
    # We'll stick to the first 1000 or so to verify, or return all if performance allows.
    # The frontend was receiving all titles, so let's try to be efficient.
    # To avoid huge payloads, let's keep it lightweight.
    
    for _, row in movies_df.iterrows():
        movie_id = row['id']
        title = row['title']
        
        # safely handle NaN IDs if any
        if pd.isna(movie_id):
            continue
            
        movie_id = int(movie_id)
        
        movies_list.append({
            "id": movie_id,
            "title": title,
            "poster": get_movie_poster_url(movie_id)
        })
        
    return movies_list

@router.get("/{movie}")
def get_recommendations(movie: str):
    """
    Returns a list of recommended movies with full details (id, title, poster).
    """
    recommended_titles = recommend_hybrid(movie)
    
    recommendations = []
    for title in recommended_titles:
        # Find the movie in our dataframe
        # Note: This linear scan for each recommendation isn't optimal but works for small datasets.
        # A lookup dict would be faster if needed later.
        match = movies_df[movies_df['title'] == title]
        
        if not match.empty:
            row = match.iloc[0]
            movie_id = row['id']
            if not pd.isna(movie_id):
                movie_id = int(movie_id)
                recommendations.append({
                    "id": movie_id,
                    "title": title,
                    "year": 2020, # Placeholder, ideally we'd get this from DF too
                    "genres": ['Drama'], # Placeholder
                    "rating": 8.0, # Placeholder
                    "poster": get_movie_poster_url(movie_id)
                })
    
    return {"recommendations": recommendations}
