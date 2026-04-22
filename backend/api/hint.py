from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from fastapi.responses import JSONResponse
from fastapi import status
import uuid
from state import sessions, connections
from ._ai_helper import get_openai_response
router = APIRouter()
import asyncio

@router.post("/hint")
async def get_hint(session_id: str):

    if session_id not in connections:
        connections[session_id] = []
    
    word = sessions[session_id]["word"]
    riddle = await get_openai_response(f"Create a riddle for the word: {word}. The riddle should be concise and not give away the word directly.")
    print(f"Generated riddle for session {session_id}: {riddle}")
    return JSONResponse(content={"session_id": session_id, "riddle": riddle}, status_code=status.HTTP_200_OK)