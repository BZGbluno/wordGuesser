from typing import Dict


sessions = {}  # session_id → game state
connections: Dict[str, list] = {}  # session_id → sockets