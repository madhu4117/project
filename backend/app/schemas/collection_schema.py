from pydantic import BaseModel
from datetime import datetime


# Create Collection
class CollectionCreate(BaseModel):
    name: str
    description: str | None = None


# Update Collection
class CollectionUpdate(BaseModel):
    name: str
    description: str | None = None


# Add Movie to Collection
class CollectionMovieCreate(BaseModel):
    movie_id: str
    movie_title: str
    poster: str | None = None


# Movie Response
class CollectionMovieResponse(BaseModel):
    id: int
    movie_id: str
    movie_title: str
    poster: str | None

    class Config:
        from_attributes = True


# Collection Response
class CollectionResponse(BaseModel):
    id: int
    name: str
    description: str | None
    created_at: datetime
    movies: list[CollectionMovieResponse] = []

    class Config:
        from_attributes = True