from Backend.DataBase.connection import get_connection


def get_transactions(user_id):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT
            transactions.type,
            transactions.amount,
            accounts.name,
            categories.name,
            transactions.date,
            transactions.description,
            transactions.id,
            transactions.account_id
        FROM transactions
        JOIN accounts
            ON transactions.account_id = accounts.id
        LEFT JOIN categories
            ON transactions.category_id = categories.id
        WHERE accounts.user_id = ?
        ORDER BY transactions.date DESC, transactions.id DESC
        """,
        (user_id,)
    )

    transactions = cursor.fetchall()

    connection.close()

    return transactions


def get_transaction(transaction_id, user_id):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT
            transactions.id,
            transactions.account_id,
            transactions.amount,
            transactions.type,
            transactions.category_id,
            transactions.date,
            transactions.description
        FROM transactions
        JOIN accounts
            ON transactions.account_id = accounts.id
        WHERE transactions.id = ?
        AND accounts.user_id = ?
        """,
        (
            transaction_id,
            user_id
        )
    )

    transaction = cursor.fetchone()

    connection.close()

    return transaction


def add_transaction(transaction, user_id):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT id, balance
        FROM accounts
        WHERE id = ?
        AND user_id = ?
        """,
        (
            transaction.account_id,
            user_id
        )
    )

    account = cursor.fetchone()

    if not account:
        connection.close()
        return False, "Invalid account"

    cursor.execute(
        """
        SELECT id, type
        FROM categories
        WHERE id = ?
        AND user_id = ?
        """,
        (
            transaction.category_id,
            user_id
        )
    )

    category = cursor.fetchone()

    if not category:
        connection.close()
        return False, "Invalid category"

    if transaction.type not in ("Income", "Expense"):
        connection.close()
        return False, "Invalid transaction type"

    if category[1] != transaction.type:
        connection.close()
        return False, "Category type does not match transaction type"

    amount = float(transaction.amount)
    current_balance = float(account[1])

    if amount <= 0:
        connection.close()
        return False, "Amount must be greater than zero"

    if transaction.type == "Expense":
        if amount > current_balance:
            connection.close()
            return False, "Insufficient balance"

        new_balance = current_balance - amount

    else:
        new_balance = current_balance + amount

    cursor.execute(
        """
        INSERT INTO transactions
        (
            account_id,
            amount,
            type,
            category_id,
            date,
            description
        )
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            transaction.account_id,
            amount,
            transaction.type,
            transaction.category_id,
            transaction.date,
            transaction.description
        )
    )

    transaction.id = cursor.lastrowid

    cursor.execute(
        """
        UPDATE accounts
        SET balance = ?
        WHERE id = ?
        AND user_id = ?
        """,
        (
            new_balance,
            transaction.account_id,
            user_id
        )
    )

    connection.commit()
    connection.close()

    return True, None


def update_transaction(transaction, user_id):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT
            transactions.account_id,
            transactions.amount,
            transactions.type,
            transactions.category_id
        FROM transactions
        JOIN accounts
            ON transactions.account_id = accounts.id
        WHERE transactions.id = ?
        AND accounts.user_id = ?
        """,
        (
            transaction.id,
            user_id
        )
    )

    old_transaction = cursor.fetchone()

    if not old_transaction:
        connection.close()
        return False, "Transaction not found"

    old_account_id = old_transaction[0]
    old_amount = float(old_transaction[1])
    old_type = old_transaction[2]

    cursor.execute(
        """
        SELECT id, balance
        FROM accounts
        WHERE id = ?
        AND user_id = ?
        """,
        (
            transaction.account_id,
            user_id
        )
    )

    new_account = cursor.fetchone()

    if not new_account:
        connection.close()
        return False, "Invalid account"

    cursor.execute(
        """
        SELECT id, type
        FROM categories
        WHERE id = ?
        AND user_id = ?
        """,
        (
            transaction.category_id,
            user_id
        )
    )

    category = cursor.fetchone()

    if not category:
        connection.close()
        return False, "Invalid category"

    if transaction.type not in ("Income", "Expense"):
        connection.close()
        return False, "Invalid transaction type"

    if category[1] != transaction.type:
        connection.close()
        return False, "Category type does not match transaction type"

    new_amount = float(transaction.amount)

    if new_amount <= 0:
        connection.close()
        return False, "Amount must be greater than zero"

    if old_account_id == transaction.account_id:

        current_balance = float(new_account[1])

        if old_type == "Income":
            current_balance -= old_amount
        else:
            current_balance += old_amount

        if transaction.type == "Income":
            current_balance += new_amount
        else:
            if new_amount > current_balance:
                connection.close()
                return False, "Insufficient balance"

            current_balance -= new_amount

        cursor.execute(
            """
            UPDATE accounts
            SET balance = ?
            WHERE id = ?
            AND user_id = ?
            """,
            (
                current_balance,
                transaction.account_id,
                user_id
            )
        )

    else:

        cursor.execute(
            """
            SELECT balance
            FROM accounts
            WHERE id = ?
            AND user_id = ?
            """,
            (
                old_account_id,
                user_id
            )
        )

        old_account = cursor.fetchone()

        if not old_account:
            connection.close()
            return False, "Old account not found"

        old_account_balance = float(old_account[0])

        if old_type == "Income":
            old_account_balance -= old_amount
        else:
            old_account_balance += old_amount

        # Apply new transaction to new account.
        new_account_balance = float(new_account[1])

        if transaction.type == "Income":
            new_account_balance += new_amount
        else:
            if new_amount > new_account_balance:
                connection.close()
                return False, "Insufficient balance"

            new_account_balance -= new_amount

        cursor.execute(
            """
            UPDATE accounts
            SET balance = ?
            WHERE id = ?
            AND user_id = ?
            """,
            (
                old_account_balance,
                old_account_id,
                user_id
            )
        )

        cursor.execute(
            """
            UPDATE accounts
            SET balance = ?
            WHERE id = ?
            AND user_id = ?
            """,
            (
                new_account_balance,
                transaction.account_id,
                user_id
            )
        )

    # Update the transaction itself.
    cursor.execute(
        """
        UPDATE transactions
        SET
            account_id = ?,
            amount = ?,
            type = ?,
            category_id = ?,
            date = ?,
            description = ?
        WHERE id = ?
        """,
        (
            transaction.account_id,
            new_amount,
            transaction.type,
            transaction.category_id,
            transaction.date,
            transaction.description,
            transaction.id
        )
    )

    connection.commit()
    connection.close()

    return True, None


def delete_transaction(transaction_id, user_id):
    connection = get_connection()
    cursor = connection.cursor()

    # Find the transaction only if it belongs to this user.
    cursor.execute(
        """
        SELECT
            transactions.account_id,
            transactions.amount,
            transactions.type
        FROM transactions
        JOIN accounts
            ON transactions.account_id = accounts.id
        WHERE transactions.id = ?
        AND accounts.user_id = ?
        """,
        (
            transaction_id,
            user_id
        )
    )

    transaction = cursor.fetchone()

    if not transaction:
        connection.close()
        return False

    account_id = transaction[0]
    amount = float(transaction[1])
    transaction_type = transaction[2]

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

    account = cursor.fetchone()

    if not account:
        connection.close()
        return False

    balance = float(account[0])

    # Undo the transaction.
    if transaction_type == "Income":
        new_balance = balance - amount
    else:
        new_balance = balance + amount

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

    cursor.execute(
        """
        DELETE FROM transactions
        WHERE id = ?
        """,
        (transaction_id,)
    )

    connection.commit()
    connection.close()

    return True