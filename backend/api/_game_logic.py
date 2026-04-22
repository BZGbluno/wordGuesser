import random
import sqlite3
import numpy as np
import math
from sentence_transformers import SentenceTransformer
import torch
model = SentenceTransformer('all-MiniLM-L6-v2')
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)


def generate_random_word():
    conn = sqlite3.connect("/app/data/embeddings.db")
    cursor = conn.cursor()

    cursor.execute("SELECT word, embedding FROM embeddings")
    rows = cursor.fetchall()

    conn.close()

    if not rows:
        raise Exception("No embeddings in database")

    word, embedding = random.choice(rows)

    return word, embedding

def embed(word):
    emb = model.encode(word)
    return emb
    
def calculate_score(inputWord, target_embedding):
    # get the embedding for the input word
    inputWordEmbedding = embed(inputWord)


    # calculate cosine similarity
    cosSim = np.dot(target_embedding, inputWordEmbedding) / (np.linalg.norm(target_embedding) * np.linalg.norm(inputWordEmbedding))

    # convert to score (0-100)
    score = 100 / (1 + math.exp(-8*(cosSim-0.5)))

    return round(score, 3)