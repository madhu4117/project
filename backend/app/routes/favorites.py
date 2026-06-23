from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.favorite import Favorite
from app.schemas.favorite_schema import FavoriteCreate
from app.utils.security import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/favorites")
def add_favorite(
    movie: FavoriteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(Favorite).filter(
        Favorite.movie_id == movie.movie_id,
        Favorite.user_id == current_user.id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Movie already in favorites"
        )
        
    db_fav = Favorite(
        movie_id=movie.movie_id,
        title=movie.title,
        poster=movie.poster,
        user_id=current_user.id
    )
    db.add(db_fav)
    db.commit()
    db.refresh(db_fav)
    return {
        "message": "Added to favorites"
    }

@router.get("/favorites")
def get_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    favorites = db.query(Favorite).filter(
        Favorite.user_id == current_user.id
    ).all()
    return favorites

@router.delete("/favorites/{movie_id}")
def remove_favorite(
    movie_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    fav = db.query(Favorite).filter(
        Favorite.movie_id == movie_id,
        Favorite.user_id == current_user.id
    ).first()
    
    if not fav:
        raise HTTPException(
            status_code=404,
            detail="Favorite not found"
        )
        
    db.delete(fav)
    db.commit()
    return {
        "message": "Removed from favorites"
    }