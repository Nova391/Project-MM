from Backend.DataBase.connection import get_connection


def get_categories(user_id):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        """
        SELECT id, name, type
        FROM categories
        WHERE user_id = ?
        """,
        (user_id,)
    )
    categories = cursor.fetchall()
    connection.close()
    return categories


def get_category(category_id, user_id):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        """
        SELECT id, name, type
        FROM categories
        WHERE id = ?
        AND user_id = ?
        """,
        (
            category_id,
            user_id
        )
    )
    category = cursor.fetchone()
    connection.close()
    return category


def add_category(category, user_id):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        """
        SELECT id
        FROM categories
        WHERE user_id = ?
        AND name = ?
        AND type = ?
        """,
        (
            user_id,
            category.name,
            category.type
        )
    )
    existing_category = cursor.fetchone()
    if existing_category:
        connection.close()
        return None
    cursor.execute(
        """
        INSERT INTO categories
        (user_id, name, type)
        VALUES (?, ?, ?)
        """,
        (
            user_id,
            category.name,
            category.type
        )
    )
    category.id = cursor.lastrowid
    connection.commit()
    connection.close()
    return category.id


def update_category(category, user_id):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        """
        UPDATE categories
        SET name = ?,
            type = ?
        WHERE id = ?
        AND user_id = ?
        """,
        (
            category.name,
            category.type,
            category.id,
            user_id
        )
    )
    updated = cursor.rowcount > 0
    connection.commit()
    connection.close()
    return updated

def delete_category(category, user_id):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        """
        DELETE FROM categories
        WHERE id = ?
        AND user_id = ?
        """,
        (
            category.id,
            user_id
        )
    )
    deleted = cursor.rowcount > 0
    connection.commit()
    connection.close()
    return deleted