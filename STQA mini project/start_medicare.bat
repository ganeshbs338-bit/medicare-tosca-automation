@echo off
title MediCare Healthcare & Online Pharmacy - Server Launcher
color 0B
echo =================================================================
echo   MediCare - Healthcare & Online Pharmacy Application
echo   Course: Software Testing & Quality Assurance
echo   Automated with Tricentis Tosca XScan
echo =================================================================
echo.

cd /d "%~dp0"

set PYTHON_BIN=""
where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    set PYTHON_BIN=python
) else if exist "%LOCALAPPDATA%\Programs\Python\Python310\python.exe" (
    set PYTHON_BIN="%LOCALAPPDATA%\Programs\Python\Python310\python.exe"
)

where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Node.js runtime detected.
    echo Starting MediCare with Node.js / Express...
    start http://localhost:5000
    node server.js
    goto end
)

if not %PYTHON_BIN%=="" (
    echo [OK] Python runtime detected: %PYTHON_BIN%
    echo Initializing database if needed...
    %PYTHON_BIN% database\init_db.py
    echo Starting MediCare Full-Stack Server on port 5000...
    timeout /t 2 >nul
    start http://localhost:5000
    %PYTHON_BIN% server.py
    goto end
)

echo [ERROR] Neither Node.js nor Python was found.
echo Please install Node.js (https://nodejs.org/) or Python 3.10 to run the server.
pause

:end
