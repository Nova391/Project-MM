from Backend.DataBase.connection import get_connection

connection = get_connection()
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

connection.commit()
connection.close()