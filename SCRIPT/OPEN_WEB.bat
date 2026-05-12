@echo off
title RCS WEB DASHBOARD
color 0E

echo ==============================================
echo   CONNECTING TO RCS DASHBOARD
echo ==============================================

:INPUT_URL
set TARGET_URL=
set /p TARGET_URL=Enter Server URL or IP (Default = localhost): 

if "%TARGET_URL%"=="" set TARGET_URL=http://localhost:5000

:: Check if it's just an IP/Hostname (doesn't start with http)
echo %TARGET_URL% | findstr /I "http" >nul
if %ERRORLEVEL% neq 0 (
    :: If no http, assume it's an IP and add http:// + port 5000
    set TARGET_URL=http://%TARGET_URL%:5000
)

echo.
echo [INFO] Connecting to: %TARGET_URL%
echo.

start "" "%TARGET_URL%"
pause