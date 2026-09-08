import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from argon2 import PasswordHasher
from fastapi import HTTPException

from Backend.DataBase.connection import get_connection


password_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return password_hasher.verify(password_hash, password)
    except Exception:
        return False


def generate_session_token() -> str:
    return secrets.token_urlsafe(32)


def hash_session_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def create_session(user_id: int) -> str:
    token = generate_session_token()
    token_hash = hash_session_token(token)

    expires_at = datetime.now(timezone.utc) + timedelta(days=7)

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO sessions (user_id, token_hash, expires_at)
        VALUES (?, ?, ?)
        """,
        (
            user_id,
            token_hash,
            expires_at.isoformat()
        )
    )

    connection.commit()
    connection.close()

    return token


def get_current_user(session: str | None):

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
        SELECT user_id, expires_at
        FROM sessions
        WHERE token_hash = ?
        """,
        (token_hash,)
    )

    session_data = cursor.fetchone()

    if not session_data:
        connection.close()

        raise HTTPException(
            status_code=401,
            detail="Invalid session"
        )

    user_id = session_data[0]
    expires_at = datetime.fromisoformat(session_data[1])

    if datetime.now(timezone.utc) >= expires_at:

        cursor.execute(
            "DELETE FROM sessions WHERE token_hash = ?",
            (token_hash,)
        )

        connection.commit()
        connection.close()

        raise HTTPException(
            status_code=401,
            detail="Session expired"
        )

    connection.close()

    return user_id