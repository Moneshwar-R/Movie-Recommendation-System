import pandas as pd
import ast
import pickle
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def extract_names(obj):
    try:
        items = ast.literal_eval(obj)
        return [i['name'].lower().replace(" ", "") for i in items]
    except:
        return []

def get_top3_cast(obj):
    try:
        items = ast.literal_eval(obj)
        return [i['name'].lower().replace(" ", "") for i in items[:3]]
    except:
        return []

def get_director(obj):
    try:
        items = ast.literal_eval(obj)
        for i in items:
            if i['job'] == 'Director':
                return [i['name'].lower().replace(" ", "")]
        return []
    except:
        return []

def load_and_process_data():
    # Load TMDB datasets
    tmdb_movies = pd.read_csv("data/tmdb_5000_movies.csv")
    tmdb_credits = pd.read_csv("data/tmdb_5000_credits.csv")
    
    # Merge datasets
    movies = tmdb_movies.merge(tmdb_credits, left_on="id", right_on="movie_id")
    movies = movies[['id','original_title','overview','genres','keywords','cast','crew']]
    
    # Process features
    movies['genres'] = movies['genres'].apply(extract_names)
    movies['keywords'] = movies['keywords'].apply(extract_names)
    movies['cast'] = movies['cast'].apply(get_top3_cast)
    movies['director'] = movies['crew'].apply(get_director)
    movies['overview'] = movies['overview'].fillna("").apply(lambda x: x.lower().split())
    
    # Create movie profile
    movies['movie_profile'] = (
        movies['overview'] +
        movies['genres'] +
        movies['keywords'] +
        movies['cast'] +
        movies['director']
    )
    movies['movie_profile'] = movies['movie_profile'].apply(lambda x: " ".join(x))
    
    return movies[['id','original_title','movie_profile']]

def build_similarity_matrix(movies_df):
    cv = CountVectorizer(max_features=5000, stop_words='english')
    vectors = cv.fit_transform(movies_df['movie_profile']).toarray()
    similarity = cosine_similarity(vectors)
    
    movie_index = pd.Series(movies_df.index, index=movies_df['original_title']).drop_duplicates()
    
    return similarity, movie_index

def recommend_content_based(movie, similarity=None, movie_index=None, movies_df=None):
    if similarity is None or movie_index is None or movies_df is None:
        # Load precomputed data
        movies_df = pd.read_csv("data/final_movies_extended.csv")
        movies_df['title'] = movies_df['title'].str.replace(r'^\d+\.\s*', '', regex=True)
        movies_df = movies_df.drop_duplicates(subset=['title'], keep='first').reset_index(drop=True)
        
        with open("data/similarity.pkl", "rb") as f:
            similarity = pickle.load(f)
        
        movie_index = pd.Series(movies_df.index, index=movies_df['title']).drop_duplicates()
    
    idx = movie_index.get(movie)
    if idx is None:
        return []
    
    sim_scores = list(enumerate(similarity[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:11]
    movie_indices = [i[0] for i in sim_scores]
    
    return movies_df['title'].iloc[movie_indices].tolist()