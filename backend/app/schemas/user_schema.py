from pydantic import BaseModel, EmailStr


# Login
class LoginSchema(BaseModel):
    email: EmailStr
    password: str


# Profile Response
class UserResponse(BaseModel):
    id: int
    name: str | None
    email: EmailStr

    class Config:
        from_attributes = True


# Update Profile
class UpdateProfile(BaseModel):
    name: str
    email: EmailStr


# Change Password
class ChangePassword(BaseModel):
    old_password: str
    new_password: str