from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    func,
)

from sqlalchemy.orm import relationship

from app.database.db import Base


class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    keyword = Column(
        String(255),
        nullable=False,
    )

    searched_at = Column(
        DateTime,
        server_default=func.now(),
    )

    user = relationship(
        "User",
        back_populates="search_histories",
    )