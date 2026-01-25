import pandas as pd
import pickle
from src.content_based import recommend_content_based
from src.colloborative import recommend_collaborative, load_ratings_data, build_user_movie_matrix, build_movie_similarity

# Global variables for caching
_similarity = None
_movie_index = None
_movies_df = None
_user_movie_matrix = None
_movie_similarity_cf = None
_movies_ml = None
_ml_to_tmdb = None
_tmdb_to_content_index = None

def _load_data():
    global _similarity, _movie_index, _movies_df, _user_movie_matrix, _movie_similarity_cf, _movies_ml, _ml_to_tmdb, _tmdb_to_content_index
    
    if _similarity is None:
        # Load content-based data
        _movies_df = pd.read_csv("data/final_movies_extended.csv")
        _movies_df['title'] = _movies_df['title'].str.replace(r'^\d+\.\s*', '', regex=True)
        _movies_df = _movies_df.drop_duplicates(subset=['title'], keep='first').reset_index(drop=True)
        
        with open("data/similarity.pkl", "rb") as f:
            _similarity = pickle.load(f)
        
        _movie_index = pd.Series(_movies_df.index, index=_movies_df['title']).drop_duplicates()
        
        # Load collaborative filtering data
        ratings, _movies_ml = load_ratings_data()
        _user_movie_matrix = build_user_movie_matrix(ratings)
        _movie_similarity_cf = build_movie_similarity(_user_movie_matrix)
        
        # Load mapping data
        links = pd.read_csv("data/links.csv")
        links = links.dropna(subset=['tmdbId'])
        links['tmdbId'] = links['tmdbId'].astype(int)
        _ml_to_tmdb = links.set_index('movieId')['tmdbId'].to_dict()
        _tmdb_to_content_index = pd.Series(_movies_df.index, index=_movies_df['id']).to_dict()

def _get_cf_scores(movie_title):
    cf_movies = recommend_collaborative(movie_title, _user_movie_matrix, _movie_similarity_cf, _movies_ml)
    
    scores = {}
    for title in cf_movies:
        # Find MovieLens id
        match = _movies_ml[_movies_ml['title'] == title]
        if match.empty:
            continue
        
        ml_id = match.iloc[0]['movieId']
        
        # Map to TMDB
        if ml_id not in _ml_to_tmdb:
            continue
        
        tmdb_id = _ml_to_tmdb[ml_id]
        
        # Map to content index
        if tmdb_id not in _tmdb_to_content_index:
            continue
        
        content_idx = _tmdb_to_content_index[tmdb_id]
        scores[content_idx] = 1  # Simple uniform score
    
    return scores

def recommend_hybrid(movie: str, alpha: float = 0.6) -> list:
    """
    Hybrid movie recommendation combining content-based and collaborative filtering.
    
    Args:
        movie: Movie title to get recommendations for
        alpha: Weight for content-based score (0-1). Higher values favor content-based.
    
    Returns:
        List of recommended movie titles
    """
    _load_data()
    
    # Get content index
    idx = _movie_index.get(movie)
    if idx is None:
        return []
    
    # Content similarity scores
    content_scores = list(enumerate(_similarity[idx]))
    
    # Collaborative scores
    cf_scores = _get_cf_scores(movie)
    
    hybrid_scores = []
    for i, c_score in content_scores:
        cf_score = cf_scores.get(i, 0)
        
        # Hybrid formula
        final_score = alpha * c_score + (1 - alpha) * cf_score
        hybrid_scores.append((i, final_score))
    
    hybrid_scores = sorted(hybrid_scores, key=lambda x: x[1], reverse=True)[1:11]
    movie_indices = [i[0] for i in hybrid_scores]
    
    return _movies_df['title'].iloc[movie_indices].tolist()