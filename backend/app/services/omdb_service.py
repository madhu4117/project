import requests
import os

OMDB_API_KEY = os.getenv("OMDB_API_KEY")

BASE_URL = "https://www.omdbapi.com/"

def search_movies(title, page=1):
    response = requests.get(
        f"{BASE_URL}?apikey={OMDB_API_KEY}&s={title}&page={page}"
    )

    data = response.json()

    if data["Response"] == "False":
        return {
            "error": data["Error"]
        }

    return data

def get_movie_details(imdb_id):
    response = requests.get(
        f"{BASE_URL}?apikey={OMDB_API_KEY}&i={imdb_id}"
    )

    data = response.json()

    if data["Response"] == "False":
        return {
            "error": data["Error"]
        }

    return data