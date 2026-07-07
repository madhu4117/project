from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.services.omdb_service import (
    search_movies,
    get_movie_details
)

from app.utils.security import get_current_user

from app.models.user import User
from app.models.search_history import SearchHistory
from app.models.review import Review

from app.database.db import get_db

router = APIRouter()


@router.get("/movies/search")
def search(
    title: str,
    page: int = 1,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if not title.strip():
        raise HTTPException(
            status_code=400,
            detail="Invalid request"
        )

    history = SearchHistory(
        user_id=current_user.id,
        keyword=title
    )

    db.add(history)
    db.commit()

    return search_movies(title, page)


# IMPORTANT: keep compare route BEFORE /movies/{imdb_id}
@router.get("/movies/compare")
def compare_movies(
    movie1: str,
    movie2: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    movie_one = get_movie_details(movie1)
    movie_two = get_movie_details(movie2)

    if not movie_one or movie_one.get("Response") == "False":
        raise HTTPException(
            status_code=404,
            detail="Movie 1 not found"
        )

    if not movie_two or movie_two.get("Response") == "False":
        raise HTTPException(
            status_code=404,
            detail="Movie 2 not found"
        )

    def get_review_stats(movie_id: str):

        reviews = db.query(Review).filter(
            Review.movie_id == movie_id
        ).all()

        total_reviews = len(reviews)

        if total_reviews == 0:
            average_rating = 0
        else:
            average_rating = sum(
                review.rating for review in reviews
            ) / total_reviews

        return {
            "average_user_rating": round(average_rating, 1),
            "total_reviews": total_reviews
        }

    movie_one_stats = get_review_stats(movie1)
    movie_two_stats = get_review_stats(movie2)

    return {
        "movie1": {
            "details": movie_one,
            "average_user_rating": movie_one_stats["average_user_rating"],
            "total_reviews": movie_one_stats["total_reviews"]
        },
        "movie2": {
            "details": movie_two,
            "average_user_rating": movie_two_stats["average_user_rating"],
            "total_reviews": movie_two_stats["total_reviews"]
        }
    }


@router.get("/movies/{imdb_id}")
def movie_details(
    imdb_id: str,
    current_user: User = Depends(get_current_user)
):

    return get_movie_details(imdb_id)