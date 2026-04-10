@echo off
REM Run FastAPI backend from any directory

cd /d "%~dp0"
cd..

echo Starting VyaparSeth API...
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

pause
