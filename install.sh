#!/bin/sh
clear && clear
echo Deleting Old Dependencies
rm -rf node_modules/
rm -rf package-lock.json
clear && clear
echo Installing Dependencies
npm i
