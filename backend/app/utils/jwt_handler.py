from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "MYSECRETKEY"

ALGORITHM = "HS256"

# Create JWT Token
def create_access_token(data: dict):

    to_encode = data.copy()

    expire = (
        datetime.utcnow()
        + timedelta(hours=1)
    )

    to_encode.update({"exp": expire})

    token = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token