#!/usr/bin/env python3

import sys
import os
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Add the project root to Python path
sys.path.append(os.path.dirname(__file__))

app = FastAPI(title="Movie Recommender API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load movies data
movies_df = pd.read_csv('data/final_movies_extended.csv')

# Create a mapping of movie_id -> poster_filename
poster_map = {}
posters_dir = 'data/poster_downloads'

try:
    if os.path.exists(posters_dir):
        # Mount static files for posters
        app.mount("/posters", StaticFiles(directory=posters_dir), name="posters")
        
        # Scan for all files in the directory
        for filename in os.listdir(posters_dir):
            if filename.endswith(('.jpg', '.jpeg', '.png')):
                parts = filename.split('_')
                if len(parts) > 1:
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
    # Return a placeholder image if no poster is found
    return f"https://via.placeholder.com/300x450/333333/ffffff?text=No+Poster"

@app.get("/")
def root():
    return {"status": "Backend running", "movies_count": len(movies_df)}

@app.get("/recommend/all")
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

if __name__ == "__main__":
    import uvicorn
    print(f"Starting server with {len(movies_df)} movies and {len(poster_map)} posters...")
    uvicorn.run(app, host="0.0.0.0", port=8000)