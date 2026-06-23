from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    func
)

from sqlalchemy.orm import relationship

from app.database.db import Base


class Collection(Base):
    __tablename__ = "collections"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    description = Column(
        String,
        nullable=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    # Relationships

    user = relationship(
        "User",
        back_populates="collections"
    )

    movies = relationship(
        "CollectionMovie",
        back_populates="collection",
        cascade="all, delete-orphan"
    )