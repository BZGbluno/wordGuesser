from fastapi import APIRouter, HTTPException, Request, WebSocket, WebSocketDisconnect
import os
import uuid
from state import sessions, connections
from ._game_logic import calculate_score
from ._game_logic import generate_random_word
import numpy as np

router = APIRouter()
def parse_embedding(blob):
    return np.frombuffer(blob, dtype=np.float32)

@router.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()

    # ensure session exists
    if session_id not in connections:
        connections[session_id] = []

    connections[session_id].append(websocket)

    try:
        while True:
            input_word = await websocket.receive_text()

            # Example: basic echo (replace with your game logic)
            session = sessions.get(session_id)

            if not session:
                await websocket.send_text("Session not found")
                continue

            score = calculate_score(input_word, session["embedding"])
            if float(score) > 95:
                # Broadcast to all connections in the session
                for conn in connections[session_id]:
                    await conn.send_json({
                        "type": "win",
                        "message": f"The word '{input_word}' is correct! Player wins!"
                    })
                
                # get another word
                rand_word, embedding = generate_random_word()
                print(f"the random word is: {rand_word}", flush=True)
                embedding = parse_embedding(embedding)  # Ensure embedding is stored as bytes
                sessions[session_id] = {
                    "word": rand_word,
                    "embedding": embedding
                }
            else:
                # send response back to same player
                await websocket.send_json({
                    "type": "score",
                    "word": input_word,
                    "score": float(score)
                })

    except WebSocketDisconnect:
        connections[session_id].remove(websocket)