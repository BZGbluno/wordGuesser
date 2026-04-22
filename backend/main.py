from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from api.create_session import router as create_session_router
from api.gameConnection import router as game_connection_router
from api.hint import router as hint_router
# start app
app = FastAPI()


# Register endpoints
app.include_router(create_session_router)
app.include_router(game_connection_router)
app.include_router(hint_router)


# Change this to match your frontend port (8081)
origins = [
    "http://localhost:8081"
]

# Add CORS middleware to allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)