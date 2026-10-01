@echo off
echo ===================================================
echo Starting CrowdTrack React Frontend (Port 5173)
echo ===================================================
cd /d "%~dp0public-transport-frontend"

npm run dev
pause
