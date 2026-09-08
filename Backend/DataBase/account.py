from Backend.DataBase.connection import get_connection


def save_account(account, user_id):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO accounts
        (user_id, name, type, currency, balance)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            user_id,
            account.name,
            account.type,
            account.currency,
            account.balance
        )
    )

    account.id = cursor.lastrowid

    connection.commit()
    connection.close()


def update_account(account, user_id):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        UPDATE accounts
        SET name = ?,
            type = ?,
            balance = ?,
            currency = ?
        WHERE id = ?
        AND user_id = ?
        """,
        (
            account.name,
            account.type,
            account.balance,
            account.currency,
            account.id,
            user_id
        )
    )

    connection.commit()
    connection.close()


def get_accounts(user_id):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT id, name, type, currency, balance
        FROM accounts
        WHERE user_id = ?
        """,
        (user_id,)
    )

    accounts = cursor.fetchall()

    connection.close()

    return accounts


def delete_account(account, user_id):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        DELETE FROM accounts
        WHERE id = ?
        AND user_id = ?
        """,
        (
            account.id,
            user_id
        )
    )

    connection.commit()
    connection.close()


def delete_all_accounts(user_id):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        DELETE FROM accounts
        WHERE user_id = ?
        """,
        (user_id,)
    )

    connection.commit()
    connection.close()


def get_account_balance(account_id, user_id):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT balance
        FROM accounts
        WHERE id = ?
        AND user_id = ?
        """,
        (
            account_id,
            user_id
        )
    )

    result = cursor.fetchone()

    connection.close()

    return result[0] if result else 0


def update_balance(account_id, new_balance, user_id):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        UPDATE accounts
        SET balance = ?
        WHERE id = ?
        AND user_id = ?
        """,
        (
            new_balance,
            account_id,
            user_id
        )
    )

    connection.commit()
    connection.close()