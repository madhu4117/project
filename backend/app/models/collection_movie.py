from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.db import Base


class CollectionMovie(Base):
    __tablename__ = "collection_movies"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    collection_id = Column(
        Integer,
        ForeignKey("collections.id"),
        nullable=False
    )

    movie_id = Column(
        String,
        nullable=False
    )

    movie_title = Column(
        String,
        nullable=False
    )

    poster = Column(
        String,
        nullable=True
    )

    # Relationship
    collection = relationship(
        "Collection",
        back_populates="movies"
    )