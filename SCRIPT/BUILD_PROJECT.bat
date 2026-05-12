@echo off
title RCS BUILD TOOL
color 0B

echo ==============================================
echo   BUILDING RCS PROJECT (PORTABLE MODE)
echo ==============================================

:: Move to project root
cd /d "%~dp0.."

:: Kill any running dotnet processes to unlock files
echo [INFO] Unlocking files...
taskkill /F /IM dotnet.exe 2>nul

:: STEP 1: Clean old build and temp files
echo [INFO] Cleaning up...
if exist "SCRIPT\RCS_Output" rmdir /s /q "SCRIPT\RCS_Output"
mkdir "SCRIPT\RCS_Output"

:: STEP 2: Build Server
echo.
echo [1/3] Building RCS Server...
dotnet publish "RCS.Server\RCS.Server.csproj" -c Release -o "SCRIPT\RCS_Output\Server" --configfile NuGet.Config --ignore-failed-sources /p:UseAppHost=false
if %ERRORLEVEL% neq 0 goto :ERROR

:: STEP 3: Copy Web Client assets
echo.
echo [2/3] Integrating Web Client...
if not exist "SCRIPT\RCS_Output\Server\wwwroot" mkdir "SCRIPT\RCS_Output\Server\wwwroot"
xcopy /E /I /Y "RCS.Client\Public\*" "SCRIPT\RCS_Output\Server\wwwroot\"
if %ERRORLEVEL% neq 0 goto :ERROR

:: STEP 4: Build Agent
echo.
echo [3/3] Building RCS Agent...
dotnet publish "RCS.Agent\RCS.Agent.csproj" -c Release -o "SCRIPT\RCS_Output\Agent" --configfile NuGet.Config --ignore-failed-sources /p:UseAppHost=false
if %ERRORLEVEL% neq 0 goto :ERROR

echo.
echo ==============================================
echo   BUILD SUCCESSFUL! (Portable Mode)
echo   Run with START_SYSTEM.bat
echo ==============================================
pause
exit /b 0

:ERROR
echo.
echo ==============================================
echo   BUILD FAILED! Please check the errors above.
echo ==============================================
pause
exit /b 1