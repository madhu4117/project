from fastapi import APIRouter

from app.schemas.user_schema import LoginSchema

router = APIRouter()

@router.post("/register")
def register(data: LoginSchema):

    return {
        "message": "User registered"
    }

@router.post("/login")
def login(data: LoginSchema):

    if (
        data.email != "user@example.com"
        or
        data.password != "password123"
    ):

        return {
            "message": "Invalid Email or Password"
        }

    return {
        "message": "Login successful"
    }