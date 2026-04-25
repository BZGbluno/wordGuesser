from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from fastapi.responses import JSONResponse
from fastapi import status
import uuid
from state import sessions, connections
from ._game_logic import generate_random_word
import numpy as np
router = APIRouter()
import random

def parse_embedding(blob):
    return np.frombuffer(blob, dtype=np.float32)


@router.post("/create")
def create_session():
    # session_id = str(uuid.uuid4())
    session_id = str(random.randint(10000, 99999))
    
    rand_word, embedding = generate_random_word()
    embedding = parse_embedding(embedding)  # Ensure embedding is stored as bytes
    sessions[session_id] = {
        "word": rand_word,
        "embedding": embedding
    }

    connections[session_id] = []

    print(f"the random word is: {rand_word}")

    return JSONResponse(content={"session_id": session_id}, status_code=status.HTTP_201_CREATED)