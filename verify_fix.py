import requests
import json

try:
    print("Fetching /recommend/all...")
    response = requests.get("http://127.0.0.1:8000/recommend/all", timeout=10)
    response.raise_for_status()
    movies = response.json()
    
    print(f"Received {len(movies)} movies.")
    
    if not isinstance(movies, list):
        print("Error: Response is not a list")
        exit(1)
        
    print("Sample movie structure:", movies[0])
    
    # Target ID from intersection: 60420
    target_id = 60420
    found = False
    for m in movies:
        if m.get('id') == target_id:
            print(f"Found target movie: {m}")
            poster_url = m.get('poster')
            if poster_url and f"_{target_id}.jpg" in poster_url and "http://localhost:8000/posters/" in poster_url:
                print(f"SUCCESS: Poster URL seems correct: {poster_url}")
                found = True
            else:
                print(f"FAILURE: Poster URL mismatch or missing. Got {poster_url}")
            break
            
    if not found:
        print(f"FAILURE: Movie with ID {target_id} not found.")

except Exception as e:
    print(f"Error: {e}")
