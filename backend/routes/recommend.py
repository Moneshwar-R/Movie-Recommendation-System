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
poster_files = []  # Store all available poster files
posters_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'poster_downloads')

try:
    if os.path.exists(posters_dir):
        # Scan for all files in the directory
        for filename in os.listdir(posters_dir):
            if filename.endswith(('.jpg', '.jpeg', '.png')):
                poster_files.append(filename)
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

print(f"Loaded {len(poster_map)} poster mappings and {len(poster_files)} total poster files")

def get_movie_poster_url(movie_id):
    """Helper to get the full poster URL for a movie ID."""
    # First try exact match
    if movie_id in poster_map:
        return f"http://localhost:8000/posters/{poster_map[movie_id]}"
    
    # If no exact match and we have poster files, use a random one as fallback
    if poster_files:
        import random
        random_poster = random.choice(poster_files)
        return f"http://localhost:8000/posters/{random_poster}"
    
    # Return a placeholder image if no poster is found
    return f"https://via.placeholder.com/300x450/333333/ffffff?text=No+Poster"

@router.get("/all")
def get_all_movies():
    """
    Returns a list of all movies with full details for the frontend.
    """
    movies_list = []
    for _, row in movies_df.iterrows():
        movie_id = int(row['id']) if not pd.isna(row['id']) else None
        if movie_id:
            movies_list.append({
                "id": movie_id,
                "title": row['title'],
                "year": 2020,  # Default year
                "genres": ['Drama'],  # Default genre
                "rating": 8.0,  # Default rating
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
