import pandas as pd
import numpy as np
import sqlite3

DB_PATH = "/app/data/embeddings.db"

df = pd.read_csv("./embeddings.csv")

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

for _, row in df.iterrows():
    word = row["word"]
    vec = str(row["vector"])  # ensure string type

    # Robust cleaning — handles newlines, brackets, multi-spaces
    vec_clean = vec.replace("\n", " ").replace("[", "").replace("]", "").strip()
    arr = np.array(vec_clean.split(), dtype=np.float32)  # ← key fix

    if arr.size == 0:
        print(f"Skipping {word}: empty vector")
        continue

    if np.isnan(arr).any():
        print(f"Skipping {word}: NaN detected")
        continue

    blob = arr.tobytes()
    cursor.execute("""
        INSERT OR REPLACE INTO embeddings (word, embedding)
        VALUES (?, ?)
    """, (word, blob))

conn.commit()
conn.close()

print("Database initialized successfully")