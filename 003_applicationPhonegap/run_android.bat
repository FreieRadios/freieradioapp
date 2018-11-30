@echo off

cd /d %~dp0

call typescript_compile_no_pause

echo Installing app on Android device...
call phonegap build android
call phonegap run android

pause