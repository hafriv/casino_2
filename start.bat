@echo off
echo Starting Casino Royale...

echo Installing backend dependencies...
cd server
call npm install

echo Starting backend server...
start cmd /k "npm run dev"

echo Installing frontend dependencies...
cd ..
call npm install

echo Starting frontend server...
start cmd /k "npm run dev"

echo Casino Royale is starting up...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Root user credentials:
echo Username: root
echo Password: 1234 