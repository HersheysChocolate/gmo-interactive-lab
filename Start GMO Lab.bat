@echo off
setlocal
cd /d "%~dp0"
where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js and npm were not found. Install Node.js, then try again.
  pause
  exit /b 1
)
if not exist "node_modules" (
  echo Installing the project dependencies. This may take a minute...
  call npm install
  if errorlevel 1 (
    echo Dependency installation failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
)
call npm run dev -- --open
pause
