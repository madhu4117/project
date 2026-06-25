from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.utils.security import get_current_user
from app.models.user import User
from app.models.review import Review
from app.schemas.review_schema import (
    ReviewCreate,
    ReviewUpdate
)
from app.services.review_service import (
    add_review,
    get_reviews_by_movie,
    update_review,
    delete_review,
    get_average_rating
)

router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"]
)


@router.post("/")
def create_review(
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    result = add_review(
        db,
        review.movie_id,
        current_user.id,
        review.rating,
        review.comments
    )

    if result is None:
        raise HTTPException(
            status_code=400,
            detail="You already reviewed this movie."
        )

    return result


@router.get("/{movie_id}")
def get_reviews(
    movie_id: str,
    db: Session = Depends(get_db)
):

    return get_reviews_by_movie(
        db,
        movie_id
    )


@router.put("/{review_id}")
def edit_review(
    review_id: int,
    review: ReviewUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        raise HTTPException(
            status_code=404,
            detail="Review not found"
        )
    if db_review.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Not authorized to edit this review"
        )

    result = update_review(
        db,
        review_id,
        review.rating,
        review.comments
    )

    return result


@router.delete("/{review_id}")
def remove_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        raise HTTPException(
            status_code=404,
            detail="Review not found"
        )
    if db_review.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Not authorized to delete this review"
        )

    success = delete_review(
        db,
        review_id
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Review not found"
        )

    return {
        "message": "Review deleted successfully"
    }


@router.get("/{movie_id}/average")
def average_rating(
    movie_id: str,
    db: Session = Depends(get_db)
):

    return {
        "average_rating":
        get_average_rating(
            db,
            movie_id
        )
    }