from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.services.omdb_service import (
    search_movies,
    get_movie_details
)

from app.utils.security import get_current_user

from app.models.user import User
from app.models.search_history import SearchHistory

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


@router.get("/movies/{imdb_id}")
def movie_details(
    imdb_id: str,
    current_user: User = Depends(get_current_user)
):
    return get_movie_details(imdb_id)