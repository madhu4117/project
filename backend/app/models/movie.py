from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database.db import Base


class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    genre = Column(String)

    year = Column(Integer)

    poster = Column(String)

    reviews = relationship(
        "Review",
        back_populates="movie",
        cascade="all, delete-orphan"
    )