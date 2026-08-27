from Backend.DataBase.connection import get_connection


def get_categories():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM categories")
    categories = cursor.fetchall()
    connection.close()
    return categories


def get_category(category_id):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM categories WHERE id = ?", (category_id,))
    category = cursor.fetchone()
    connection.close()
    return category


def add_category(category):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("""
        INSERT INTO categories (name, type)
        VALUES (?, ?)
    """, (
        category.name,
        category.type
    ))
    category.id = cursor.lastrowid
    connection.commit()
    connection.close()
    return category.id


def update_category(category):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("""
        UPDATE categories
        SET name = ?, type = ?
        WHERE id = ?
    """, (
        category.name,
        category.type,
        category.id
    ))
    connection.commit()
    connection.close()


def delete_category(category):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        "DELETE FROM categories WHERE id = ?",
        (category.id,)
    )
    connection.commit()
    connection.close()