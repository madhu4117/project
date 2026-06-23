from pydantic import BaseModel
from datetime import datetime


class ReviewCreate(BaseModel):
    movie_id: str
    rating: int
    comments: str


class ReviewUpdate(BaseModel):
    rating: int
    comments: str


class ReviewResponse(BaseModel):
    id: int
    movie_id: str
    user_id: int
    rating: int
    comments: str | None
    created_at: datetime

    class Config:
        from_attributes = True