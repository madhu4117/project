from sqlalchemy.orm import Session
from app.models.review import Review


def add_review(db: Session, movie_id: str, user_id: int, rating: int, comments: str):

    existing_review = (
        db.query(Review)
        .filter(
            Review.user_id == user_id,
            Review.movie_id == movie_id
        )
        .first()
    )

    if existing_review:
        return None

    review = Review(
        movie_id=movie_id,
        user_id=user_id,
        rating=rating,
        comments=comments
    )

    db.add(review)
    db.commit()
    db.refresh(review)

    return review


def get_reviews_by_movie(db: Session, movie_id: str):

    reviews = (
        db.query(Review)
        .filter(
            Review.movie_id == movie_id
        )
        .all()
    )

    return reviews


def update_review(
    db: Session,
    review_id: int,
    rating: int,
    comments: str
):

    review = (
        db.query(Review)
        .filter(
            Review.id == review_id
        )
        .first()
    )

    if not review:
        return None

    review.rating = rating
    review.comments = comments

    db.commit()
    db.refresh(review)

    return review


def delete_review(
    db: Session,
    review_id: int
):

    review = (
        db.query(Review)
        .filter(
            Review.id == review_id
        )
        .first()
    )

    if not review:
        return False

    db.delete(review)
    db.commit()

    return True


def get_average_rating(
    db: Session,
    movie_id: str
):

    reviews = (
        db.query(Review)
        .filter(
            Review.movie_id == movie_id
        )
        .all()
    )

    if len(reviews) == 0:
        return 0

    total = sum(review.rating for review in reviews)

    return round(total / len(reviews), 1)