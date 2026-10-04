@echo off
setlocal
cd /d "%~dp0"
if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo.
    echo npm install failed. Check Node.js and your internet connection.
    pause
    exit /b 1
  )
)
echo.
echo Starting SQL Analyst Academy...
call npm run dev
pause
