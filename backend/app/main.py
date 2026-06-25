
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Routes
from app.routes.auth import router as auth_router
from app.routes.favorites import router as favorites_router
from app.routes.movies import router as movies_router
from app.routes.history import router as history_router
from app.routes.dashboard import router as dashboard_router
from app.routes.reviews import router as reviews_router
from app.routes.admin import router as admin_router
from app.routes.collections import router as collections_router
from app.routes.profile import router as profile_router

# Database
from app.database.db import (
    engine,
    Base,
    SessionLocal
)

# Models
from app.models.user import User
from app.models.favorite import Favorite
from app.models.search_history import SearchHistory
from app.models.review import Review
from app.models.collection import Collection
from app.models.collection_movie import CollectionMovie

# Utils
from app.utils.security import hash_password


# Create all tables
Base.metadata.create_all(bind=engine)


# Create default admin user
db = SessionLocal()

try:

    if db.query(User).count() == 0:

        default_user = User(
            name="Admin",
            email="user@example.com",
            password=hash_password(
                "password123"
            ),
            role="admin"
        )

        db.add(default_user)
        db.commit()

finally:
    db.close()


# FastAPI app
app = FastAPI()


# # CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:3000",
#         "http://127.0.0.1:3000"
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"]
# )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth_router)
app.include_router(favorites_router)
app.include_router(movies_router)
app.include_router(history_router)
app.include_router(dashboard_router)
app.include_router(reviews_router)
app.include_router(admin_router)
app.include_router(collections_router)
app.include_router(profile_router)


@app.get("/")
def home():

    return {
        "message": "Backend Running"
    }

