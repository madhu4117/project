from sqlalchemy.orm import Session

from app.models.collection import Collection
from app.models.collection_movie import CollectionMovie


# Create collection
def create_collection(
    db: Session,
    user_id: int,
    name: str,
    description: str
):
    collection = Collection(
        user_id=user_id,
        name=name,
        description=description
    )

    db.add(collection)
    db.commit()
    db.refresh(collection)

    return collection


# Get all collections
def get_collections(
    db: Session,
    user_id: int
):
    return (
        db.query(Collection)
        .filter(Collection.user_id == user_id)
        .all()
    )


# Get one collection
def get_collection(
    db: Session,
    collection_id: int
):
    return (
        db.query(Collection)
        .filter(Collection.id == collection_id)
        .first()
    )


# Update collection
def update_collection(
    db: Session,
    collection_id: int,
    name: str,
    description: str
):
    collection = (
        db.query(Collection)
        .filter(Collection.id == collection_id)
        .first()
    )

    if collection is None:
        return None

    collection.name = name
    collection.description = description

    db.commit()
    db.refresh(collection)

    return collection


# Delete collection
def delete_collection(
    db: Session,
    collection_id: int
):
    collection = (
        db.query(Collection)
        .filter(Collection.id == collection_id)
        .first()
    )

    if collection is None:
        return False

    db.delete(collection)
    db.commit()

    return True


# Add movie to collection
def add_movie_to_collection(
    db: Session,
    collection_id: int,
    movie_id: str,
    movie_title: str,
    poster: str
):
    movie = CollectionMovie(
        collection_id=collection_id,
        movie_id=movie_id,
        movie_title=movie_title,
        poster=poster
    )

    db.add(movie)
    db.commit()
    db.refresh(movie)

    return movie


# Remove movie from collection
def remove_movie_from_collection(
    db: Session,
    collection_id: int,
    movie_id: str
):
    movie = (
        db.query(CollectionMovie)
        .filter(
            CollectionMovie.collection_id == collection_id,
            CollectionMovie.movie_id == movie_id
        )
        .first()
    )

    if movie is None:
        return False

    db.delete(movie)
    db.commit()

    return True