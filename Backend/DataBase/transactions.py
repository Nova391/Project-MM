from Backend.DataBase.connection import get_connection

def get_transactions():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("""SELECT transactions.type, transactions.amount, accounts.name, categories.name, transactions.date, transactions.description FROM transactions JOIN accounts ON transactions.account_id = accounts.id JOIN categories ON transactions.category_id = categories.id""")
    transactions = cursor.fetchall()
    connection.close()
    return transactions

def get_transaction(transaction_id):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM transactions WHERE id = ?", (transaction_id,))
    transaction = cursor.fetchall()
    connection.close()
    return transaction

def add_transaction(transaction):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("""
        INSERT INTO transactions
        (account_id, amount, type, category_id, date, description)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        transaction.account_id,
        transaction.amount,
        transaction.type,
        transaction.category_id,
        transaction.date,
        transaction.description
    ))
    transaction.id = cursor.lastrowid
    connection.commit()
    connection.close()

def update_transaction(transaction):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("""
        UPDATE transactions
        SET amount = ?, type = ?, date = ?, description = ?
        WHERE id = ? """, (
            transaction.amount,
            transaction.type,
            transaction.date,
            transaction.description,
            transaction.id
        ))
    connection.commit()
    connection.close()

def delete_transaction(transaction_id):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM transactions WHERE id = ?", (transaction_id,))
    connection.commit()
    connection.close()
