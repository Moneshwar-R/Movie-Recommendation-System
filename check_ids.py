import pandas as pd
import os

try:
    links = pd.read_csv('data/links.csv')
    movies = pd.read_csv('data/final_movies_extended.csv')
    posters = os.listdir('data/poster_downloads')
    
    poster_ids = []
    for p in posters:
        parts = p.split('_')
        if len(parts) > 1:
            pid = parts[1].split('.')[0]
            if pid.isdigit():
                poster_ids.append(int(pid))
    
    print(f"Total posters: {len(posters)}")
    print(f"Parsed IDs: {len(poster_ids)}")
    
    # Check intersection with movies['id'] (TMDB)
    movies_ids = set(movies['id'].dropna().astype(int))
    intersection_movies = set(poster_ids).intersection(movies_ids)
    print(f"Intersection with movies['id']: {len(intersection_movies)}")
    if len(intersection_movies) > 0:
        print(f"Example matches: {list(intersection_movies)[:20]}")
    else:
        print("No intersection with movies['id']")

    # Check intersection with links['movieId']
    links_movie_ids = set(links['movieId'].dropna().astype(int))
    intersection_links_movie = set(poster_ids).intersection(links_movie_ids)
    print(f"Intersection with links['movieId']: {len(intersection_links_movie)}")
    
    # Check intersection with links['tmdbId']
    links_tmdb_ids = set(links['tmdbId'].dropna().astype(int))
    intersection_links_tmdb = set(poster_ids).intersection(links_tmdb_ids)
    print(f"Intersection with links['tmdbId']: {len(intersection_links_tmdb)}")

except Exception as e:
    print(f"Error: {e}")
