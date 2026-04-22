#!/bin/bash

# starting up the server
echo "🚀 Starting FastAPI server..."

python createTables.py
python moveToDb.py
echo "✅ Database tables created"


uvicorn main:app --host 0.0.0.0 --port 8000 --reload