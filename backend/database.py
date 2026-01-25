from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()  # loads .env file

MONGO_URL = os.getenv("MONGO_URL")

client = MongoClient(MONGO_URL)
db = client["movie_recommender"]

users_collection = db["users"]
watched_collection = db["watched"]
