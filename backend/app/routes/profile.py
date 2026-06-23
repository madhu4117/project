from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.user import User
from app.schemas.user_schema import (
    UserResponse,
    UpdateProfile,
    ChangePassword
)
from app.utils.security import (
    hash_password,
    verify_password
)

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


# View profile
@router.get("/", response_model=UserResponse)
def get_profile(db: Session = Depends(get_db)):

    user = db.query(User).filter(
        User.id == 1
    ).first()

    return user


# Edit profile
@router.put("/")
def update_profile(
    data: UpdateProfile,
    db: Session = Depends(get_db)
):

    existing_email = db.query(User).filter(
        User.email == data.email,
        User.id != 1
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    user = db.query(User).filter(
        User.id == 1
    ).first()

    user.name = data.name
    user.email = data.email

    db.commit()

    return {
        "message": "Profile updated successfully"
    }


# Change password
@router.put("/change-password")
def change_password(
    data: ChangePassword,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.id == 1
    ).first()

    if not verify_password(
            data.old_password,
            user.password):
        raise HTTPException(
            status_code=400,
            detail="Old password incorrect"
        )

    user.password = hash_password(
        data.new_password
    )

    db.commit()

    return {
        "message": "Password changed successfully"
    }