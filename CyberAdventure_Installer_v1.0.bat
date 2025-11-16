@echo off
title Cyber Adventure Installer
color 0A

:menu
cls
echo ========================================
echo       Welcome To Cyber Adventure!
echo   This is version 1.0. Brought to you by
echo             CyberRangers!
echo ========================================
echo.
echo Please choose an option:
echo [1] Install and run Cyber Adventure
echo [2] Uninstall Cyber Adventure
echo [3] Exit
echo.

set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" goto install
if "%choice%"=="2" goto uninstall
if "%choice%"=="3" exit
echo Invalid selection. Please try again.
pause
goto menu

:install
echo Installing Cyber Adventure...
echo.

set hostsFile=%SystemRoot%\System32\drivers\etc\hosts

:: Backup existing hosts file
copy "%hostsFile%" "%hostsFile%.bak" >nul

:: Add entries if they don't already exist
findstr /C:"10.51.33.24 cyberrangers.local" "%hostsFile%" >nul || (
    echo 10.51.33.24 cyberrangers.local>>"%hostsFile%"
)
findstr /C:"10.51.33.24 play.cyberrangers.local" "%hostsFile%" >nul || (
    echo 10.51.33.24 play.cyberrangers.local>>"%hostsFile%"
)
findstr /C:"10.51.33.24 pusher.cyberrangers.local" "%hostsFile%" >nul || (
    echo 10.51.33.24 pusher.cyberrangers.local>>"%hostsFile%"
)
findstr /C:"10.51.33.24 maps.cyberrangers.local" "%hostsFile%" >nul || (
    echo 10.51.33.24 maps.cyberrangers.local>>"%hostsFile%"
)

echo Entries successfully added to hosts file.
echo Launching your default browser...
start http://cyberrangers.local
echo.
pause
goto menu

:uninstall
echo Uninstalling Cyber Adventure...
echo.

set hostsFile=%SystemRoot%\System32\drivers\etc\hosts
set tempFile=%temp%\hosts_temp.txt

:: Remove entries from hosts file
findstr /V "10.51.33.24 cyberrangers.local" "%hostsFile%" | findstr /V "10.51.33.24 play.cyberrangers.local" | findstr /V "10.51.33.24 pusher.cyberrangers.local" | findstr /V "10.51.33.24 maps.cyberrangers.local" > "%tempFile%"

:: Replace old hosts file with the cleaned version
copy /Y "%tempFile%" "%hostsFile%" >nul
del "%tempFile%"

echo Cyber Adventure has been successfully removed!
echo.
pause
goto menu
