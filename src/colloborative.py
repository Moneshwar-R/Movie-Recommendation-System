import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

def load_ratings_data():
    ratings = pd.read_csv("data/ratings.csv")
    movies_ml = pd.read_csv("data/movies.csv")
    return ratings, movies_ml

def build_user_movie_matrix(ratings):
    return ratings.pivot_table(
        index='userId',
        columns='movieId', 
        values='rating'
    )

def build_movie_similarity(user_movie_matrix):
    return cosine_similarity(user_movie_matrix.T.fillna(0))

def recommend_collaborative(movie_title, user_movie_matrix=None, movie_similarity_cf=None, movies_ml=None):
    if user_movie_matrix is None or movie_similarity_cf is None or movies_ml is None:
        # Load precomputed data
        ratings, movies_ml = load_ratings_data()
        user_movie_matrix = build_user_movie_matrix(ratings)
        movie_similarity_cf = build_movie_similarity(user_movie_matrix)
    
    # Find movieId
    matches = movies_ml[movies_ml['title'].str.contains(movie_title, case=False)]
    if matches.empty:
        return []
    
    movie_id = matches.iloc[0]['movieId']
    
    try:
        idx = list(user_movie_matrix.columns).index(movie_id)
    except ValueError:
        return []
    
    sim_scores = list(enumerate(movie_similarity_cf[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:11]
    
    movie_indices = [user_movie_matrix.columns[i[0]] for i in sim_scores]
    movie_id_map = movies_ml.set_index('movieId')['title']
    
    return movie_id_map.loc[movie_indices].tolist()