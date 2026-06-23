from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.db import get_db

from app.models.user import User
from app.models.review import Review
from app.models.favorite import Favorite
from app.models.search_history import SearchHistory


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


# ==========================
# Dashboard Statistics
# ==========================
@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):

    total_users = db.query(User).count()

    total_reviews = db.query(Review).count()

    total_favorites = db.query(Favorite).count()

    most_movie = (
        db.query(
            SearchHistory.keyword,
            func.count(SearchHistory.keyword)
        )
        .group_by(SearchHistory.keyword)
        .order_by(
            func.count(SearchHistory.keyword).desc()
        )
        .first()
    )

    return {
        "total_users": total_users,
        "total_reviews": total_reviews,
        "total_favorites": total_favorites,
        "most_searched_movie":
            most_movie[0] if most_movie else "N/A"
    }


# ==========================
# Users List
# ==========================
@router.get("/users")
def get_users(db: Session = Depends(get_db)):

    users = db.query(User).all()

    return [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role.capitalize()
        }
        for user in users
    ]


# ==========================
# Review Moderation
# ==========================
@router.get("/reviews")
def get_reviews(db: Session = Depends(get_db)):

    reviews = db.query(Review).all()

    return [
        {
            "id": review.id,
            "movie_id": review.movie_id,
            "rating": review.rating,
            "comments": review.comments
        }
        for review in reviews
    ]


# ==========================
# Delete Review
# ==========================
@router.delete("/reviews/{review_id}")
def delete_review(
    review_id: int,
    db: Session = Depends(get_db)
):

    review = (
        db.query(Review)
        .filter(Review.id == review_id)
        .first()
    )

    if review:
        db.delete(review)
        db.commit()

    return {
        "message": "Review deleted successfully"
    }