

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.hybrid import recommend_hybrid

def test_recommendations():
    print("Testing Hybrid Movie Recommender...")
    
    # Test cases
    test_movies = ["Inception", "Toy Story", "The Dark Knight"]
    
    for movie in test_movies:
        print(f"\nRecommendations for '{movie}':")
        try:
            recommendations = recommend_hybrid(movie, alpha=0.6)
            if recommendations:
                for i, rec in enumerate(recommendations, 1):
                    print(f"{i}. {rec}")
            else:
                print("No recommendations found")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    test_recommendations()