import sqlite3

def get_connection():
    connection = sqlite3.connect("ProjectMM.db")
    connection.execute("PRAGMA foreign_keys = ON")
    return connection