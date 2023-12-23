@echo off
color 02
cls && cls
echo Deleting Old Dependencies
del /Q node_modules/
del /Q package-lock.json
cls && cls
echo Installing Dependencies
npm i
