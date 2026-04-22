import sqlite3

# connect to database file (it will be created if it doesn't exist)
conn = sqlite3.connect("/app/data/embeddings.db")
cursor = conn.cursor()

# SQL statement
cursor.execute("""
CREATE TABLE IF NOT EXISTS embeddings (
    word TEXT PRIMARY KEY,
    embedding BLOB
);
""")

# save changes
conn.commit()

# close connection
conn.close()