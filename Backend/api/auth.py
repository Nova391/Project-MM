from fastapi import APIRouter, Cookie, HTTPException, Response
from pydantic import BaseModel

from Backend.Auth.auth import (
    hash_password,
    verify_password,
    create_session,
    hash_session_token,
)

from Backend.DataBase.connection import get_connection


router = APIRouter(prefix="/auth", tags=["Authentication"])


class RegisterRequest(BaseModel):
    username: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


# =========================
# REGISTER
# =========================

@router.post("/register")
def register(data: RegisterRequest, response: Response):

    username = data.username.strip()

    if not username:
        raise HTTPException(
            status_code=400,
            detail="Username is required"
        )

    if len(username) < 3:
        raise HTTPException(
            status_code=400,
            detail="Username must be at least 3 characters"
        )

    if len(data.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters"
        )

    connection = get_connection()
    cursor = connection.cursor()

    # Check if username already exists
    cursor.execute(
        "SELECT id FROM users WHERE username = ?",
        (username,)
    )

    existing_user = cursor.fetchone()

    if existing_user:
        connection.close()

        raise HTTPException(
            status_code=409,
            detail="Username already exists"
        )

    # Hash password
    password_hash = hash_password(data.password)

    # Create user
    cursor.execute(
        """
        INSERT INTO users (username, password_hash)
        VALUES (?, ?)
        """,
        (username, password_hash)
    )

    user_id = cursor.lastrowid

    # =========================
    # DEFAULT CATEGORIES
    # =========================

    default_categories = [
        ("Salary", "Income"),
        ("Freelance", "Income"),
        ("Gift", "Income"),

        ("Food", "Expense"),
        ("Transportation", "Expense"),
        ("Shopping", "Expense"),
        ("Bills", "Expense"),
        ("Entertainment", "Expense"),
    ]

    for name, category_type in default_categories:

        cursor.execute(
            """
            INSERT INTO categories (user_id, name, type)
            VALUES (?, ?, ?)
            """,
            (
                user_id,
                name,
                category_type
            )
        )

    connection.commit()
    connection.close()

    token = create_session(user_id)

    response.set_cookie(
        key="session",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=7 * 24 * 60 * 60
    )

    return {
        "message": "Registration successful"
    }


# =========================
# LOGIN
# =========================

@router.post("/login")
def login(data: LoginRequest, response: Response):

    username = data.username.strip()

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT id, password_hash
        FROM users
        WHERE username = ?
        """,
        (username,)
    )

    user = cursor.fetchone()

    connection.close()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    user_id = user[0]
    password_hash = user[1]

    if not verify_password(
        data.password,
        password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    token = create_session(user_id)

    response.set_cookie(
        key="session",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=7 * 24 * 60 * 60
    )

    return {
        "message": "Login successful"
    }


# =========================
# CURRENT USER
# =========================

@router.get("/me")
def get_current_user(
    session: str | None = Cookie(default=None)
):

    if not session:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )

    token_hash = hash_session_token(session)

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT
            sessions.user_id,
            sessions.expires_at,
            users.username
        FROM sessions
        JOIN users
            ON sessions.user_id = users.id
        WHERE sessions.token_hash = ?
        """,
        (token_hash,)
    )

    session_data = cursor.fetchone()

    connection.close()

    if not session_data:
        raise HTTPException(
            status_code=401,
            detail="Invalid session"
        )

    user_id = session_data[0]
    expires_at = session_data[1]
    username = session_data[2]

    return {
        "user_id": user_id,
        "username": username,
        "expires_at": expires_at
    }


# =========================
# LOGOUT
# =========================

@router.post("/logout")
def logout(
    response: Response,
    session: str | None = Cookie(default=None)
):

    if session:

        token_hash = hash_session_token(session)

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            DELETE FROM sessions
            WHERE token_hash = ?
            """,
            (token_hash,)
        )

        connection.commit()
        connection.close()

    response.delete_cookie("session")

    return {
        "message": "Logged out"
    }