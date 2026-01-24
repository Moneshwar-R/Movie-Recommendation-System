import streamlit as st
import pandas as pd
import pickle
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "..", "data")

movies = pd.read_csv(os.path.join(DATA_DIR, "final_movies_extended.csv"))

with open(os.path.join(DATA_DIR, "similarity.pkl"), "rb") as f:
    similarity = pickle.load(f)

# Build index
movie_index = pd.Series(
    movies.index,
    index=movies['title']
).drop_duplicates()

def recommend(movie):
    idx = movie_index.get(movie)

    if idx is None:
        return []

    sim_scores = list(enumerate(similarity[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:11]
    movie_indices = [i[0] for i in sim_scores]

    return movies['title'].iloc[movie_indices].tolist()

# ---------- UI ----------
st.set_page_config(page_title="Hybrid Movie Recommender", layout="centered")

st.title("🎬 Hybrid Movie Recommendation System")
st.write("Content-Based + Collaborative Filtering (Hollywood + Tamil)")

selected_movie = st.selectbox(
    "Search and select a movie:",
    sorted(movies['title'].unique())
)

if st.button("Recommend"):
    results = recommend(selected_movie)

    st.subheader("Recommended Movies:")
    for m in results:
        st.write("•", m)
