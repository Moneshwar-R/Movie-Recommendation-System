#!/usr/bin/env python3

import sys
import os
import pandas as pd

# Add the project root to Python path
sys.path.append(os.path.dirname(__file__))

# Test the movie data loading
def test_movie_data():
    try:
        # Load movies data
        movies_df = pd.read_csv('data/final_movies_extended.csv')
        print(f"Loaded {len(movies_df)} movies")
        print("First 5 movies:")
        print(movies_df[['id', 'title']].head())
        
        # Test poster mapping
        poster_map = {}
        posters_dir = 'data/poster_downloads'
        
        if os.path.exists(posters_dir):
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
            print(f"Found {len(poster_map)} posters")
        else:
            print(f"Posters directory not found at {posters_dir}")
        
        # Create sample movie objects
        movies_list = []
        for _, row in movies_df.head(10).iterrows():
            movie_id = int(row['id']) if not pd.isna(row['id']) else None
            if movie_id:
                poster_url = f"http://localhost:8000/posters/{poster_map[movie_id]}" if movie_id in poster_map else "https://via.placeholder.com/300x450/333333/ffffff?text=No+Poster"
                movies_list.append({
                    "id": movie_id,
                    "title": row['title'],
                    "year": 2020,
                    "genres": ['Drama'],
                    "rating": 8.0,
                    "poster": poster_url
                })
        
        print("\nSample movie objects:")
        for movie in movies_list[:3]:
            print(f"- {movie['title']} (ID: {movie['id']})")
            print(f"  Poster: {movie['poster']}")
        
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    test_movie_data()