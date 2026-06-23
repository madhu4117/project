from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.collection_schema import CollectionResponse

from app.database.db import get_db

from app.schemas.collection_schema import (
    CollectionCreate,
    CollectionUpdate,
    CollectionMovieCreate
)

from app.services.collection_service import (
    create_collection,
    get_collections,
    get_collection,
    update_collection,
    delete_collection,
    add_movie_to_collection,
    remove_movie_from_collection
)

router = APIRouter(
    prefix="/collections",
    tags=["Collections"]
)


# Create collection
@router.post("/")
def create_new_collection(
    collection: CollectionCreate,
    db: Session = Depends(get_db)
):
    return create_collection(
        db=db,
        user_id=1,
        name=collection.name,
        description=collection.description
    )


# Get all collections
@router.get(
    "/",
    response_model=list[CollectionResponse]
)
def get_all_collections(
    db: Session = Depends(get_db)
):
    return get_collections(
        db=db,
        user_id=1
    )


# Get one collection
@router.get("/{collection_id}")
def get_single_collection(
    collection_id: int,
    db: Session = Depends(get_db)
):
    collection = get_collection(
        db,
        collection_id
    )

    if collection is None:
        raise HTTPException(
            status_code=404,
            detail="Collection not found"
        )

    return collection


# Update collection
@router.put("/{collection_id}")
def edit_collection(
    collection_id: int,
    collection: CollectionUpdate,
    db: Session = Depends(get_db)
):
    result = update_collection(
        db,
        collection_id,
        collection.name,
        collection.description
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Collection not found"
        )

    return result


# Delete collection
@router.delete("/{collection_id}")
def remove_collection(
    collection_id: int,
    db: Session = Depends(get_db)
):
    success = delete_collection(
        db,
        collection_id
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Collection not found"
        )

    return {
        "message": "Collection deleted successfully"
    }


# Add movie to collection
@router.post("/{collection_id}/movies")
def add_movie(
    collection_id: int,
    movie: CollectionMovieCreate,
    db: Session = Depends(get_db)
):
    return add_movie_to_collection(
        db,
        collection_id,
        movie.movie_id,
        movie.movie_title,
        movie.poster
    )


# Remove movie from collection
@router.delete("/{collection_id}/movies/{movie_id}")
def remove_movie(
    collection_id: int,
    movie_id: str,
    db: Session = Depends(get_db)
):
    success = remove_movie_from_collection(
        db,
        collection_id,
        movie_id
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Movie not found"
        )

    return {
        "message": "Movie removed successfully"
    }