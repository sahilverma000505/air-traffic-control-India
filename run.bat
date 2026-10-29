@echo off
title Air Traffic Control of India - DAA Mini Project
color 0B

echo ============================================================================
echo   AIR TRAFFIC CONTROL OF INDIA - PRIM'S ALGORITHM MST
echo   DAA Mini Project with Interactive Radar HUD, SQLite, JDBC & Hibernate
echo ============================================================================
echo.
echo Starting Python HTTP REST Server and opening interactive dashboard...
echo.

start "" "http://localhost:8000"
python server.py

pause
