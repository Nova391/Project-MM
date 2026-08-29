from Backend.DataBase.connection import get_connection

def save_account(account):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("""
        INSERT INTO accounts (name, type, currency, balance)
        VALUES (?, ?, ?, ?)
    """, (
        account.name,
        account.type,
        account.currency,
        account.balance
    ))
    account.id = cursor.lastrowid
    connection.commit()
    connection.close()

def update_account(account):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("""
        UPDATE accounts 
        SET name = ?, 
            type = ?, 
            balance = ?, 
            currency = ?
        WHERE id = ?
    """, (
        account.name,
        account.type,
        account.balance,
        account.currency,
        account.id
    ))
    connection.commit()
    connection.close()

def get_accounts():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM accounts")
    accounts = cursor.fetchall()
    connection.close()
    return accounts

def delete_account(account):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM accounts WHERE id = ?", (account.id,))
    connection.commit()
    connection.close()

def delete_all_accounts():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM accounts")
    connection.commit()
    connection.close()

def get_account_balance(account_id):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT balance FROM accounts WHERE id = ?", (account_id,))
    result = cursor.fetchone()
    connection.close()
    return result[0] if result else 0

def update_balance(account_id, new_balance):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("UPDATE accounts SET balance = ? WHERE id = ?", (new_balance, account_id))
    connection.commit()
    connection.close()