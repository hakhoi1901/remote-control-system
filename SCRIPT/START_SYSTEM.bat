@echo off
title RCS SYSTEM LAUNCHER
color 0A

:: Move to script directory to ensure relative paths work
cd /d "%~dp0"

:: Check if built
if not exist "RCS_Output\Server\RCS.Server.dll" (
    echo [ERROR] Build files not found!
    echo Please run BUILD_PROJECT.bat first.
    pause
    exit
)

echo [1/2] Starting Server...
cd "RCS_Output\Server"
start "RCS Server Console" dotnet RCS.Server.dll

echo Waiting for Server to start (3s)...
timeout /t 3 /nobreak >nul

echo [2/2] Starting Agent...
cd "..\Agent"
start "RCS Agent Console" dotnet RCS.Agent.dll 127.0.0.1 

echo ===========================================
echo   SYSTEM IS RUNNING!
echo   Web Dashboard: http://localhost:5000
echo ===========================================
exit