@echo off

cd /d %~dp0

call mkdir __tmp_compile

echo Compiling TypeScript sources...
call mkdir __tmp_compile\freeradios
call tsc --out  __tmp_compile\freeradios\freeradios.js -d typescript\__start__.ts

echo Minifying and copying JavaScript...
call uglifyjs  __tmp_compile\freeradios\freeradios.js -o  __tmp_compile\freeradios\freeradios.min.js -m
call copy __tmp_compile\freeradios\freeradios.min.js www\js\freeradios.min.js >nul

echo Cleaning up...
rmdir /S /Q __tmp_compile

echo Finished!