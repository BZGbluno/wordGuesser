from fastapi import APIRouter, HTTPException, Request, WebSocket, WebSocketDisconnect
import os
import uuid
from state import sessions, connections
from ._game_logic import calculate_score
router = APIRouter()


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

            # TODO: replace this with your VectorSearch logic
            score = calculate_score(input_word, session["embedding"])

            # send response back to same player
            await websocket.send_json({
                "type": "score",
                "word": input_word,
                "score": float(score)
            })

    except WebSocketDisconnect:
        connections[session_id].remove(websocket)