import sqlite3

from Logic.account import Account

connection = sqlite3.connect("ProjectMM.db")
connection.execute("PRAGMA foreign_keys = ON")
cursor = connection.cursor()

cursor.execute(""" CREATE TABLE IF NOT EXISTS
accounts( id INTEGER PRIMARY KEY, 
name TEXT, 
type TEXT, 
currency TEXT, 
balance INTEGER )
""")

cursor.execute(""" CREATE TABLE IF NOT EXISTS 
categories( id INTEGER PRIMARY KEY,
name TEXT,
type TEXT )
""")

cursor.execute(""" CREATE TABLE IF NOT EXISTS 
goals( id INTEGER PRIMARY KEY,
name TEXT,
target_amount INTEGER,
current_amount INTEGER,
deadline TEXT)
""")

cursor.execute(""" CREATE TABLE IF NOT EXISTS
transactions( id INTEGER PRIMARY KEY, 
account_id INTEGER, 
amount INTEGER, 
type TEXT, 
category_id INTEGER, 
date TEXT, 
description TEXT, 
FOREIGN KEY (account_id) REFERENCES accounts(id),
FOREIGN KEY (category_id) REFERENCES categories(id))
""")

def save_account(account):
    connection = sqlite3.connect("ProjectMM.db")
    cursor = connection.cursor()
    cursor.execute("""
        INSERT INTO accounts (name, type, balance, currency)
        VALUES (?, ?, ?, ?)
    """, (
        account.name,
        account.type,
        account.balance,
        account.currency
    ))
    connection.commit()
    connection.close()

def get_accounts():
    connection = sqlite3.connect("ProjectMM.db")
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM accounts")
    accounts = cursor.fetchall()
    connection.close()
    return accounts

def delete_account(account):
    connection = sqlite3.connect("ProjectMM.db")
    cursor = connection.cursor()
    cursor.execute("DELETE FROM accounts WHERE id = ?", (account.id,))
    connection.commit()
    connection.close()

def delete_all_accounts():
    connection = sqlite3.connect("ProjectMM.db")
    cursor = connection.cursor()
    cursor.execute("DELETE FROM accounts")
    connection.commit()
    connection.close()