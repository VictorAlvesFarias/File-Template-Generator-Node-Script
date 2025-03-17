@echo off
setlocal enabledelayedexpansion

:: Correct full path configuration
set ACDSL="%~dp0index.js"
set ACDSL2="%~dp0templateManager.js"

:: Check Node.js path
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js is not installed or not in PATH.
    exit /b 1
)

:: Check if a flag was provided
if "%~1"=="" (
    echo Please provide a flag. Example: --add, --remove, --list, --generate.
    exit /b 1
)

:: Process the flags
if "%~1"=="--add" (
    if "%~2"=="" (
        echo "Usage: --add <template-name> <template-path>"
        exit /b 1
    )
    echo Executing: node %ACDSL% add %2 %3
    node %ACDSL2% add %2 %3
    exit /b
)

if "%~1"=="--remove" (
    if "%~2"=="" (
        echo "Usage: --remove <template-name>"
        exit /b 1
    )
    echo Executing: node %ACDSL% remove %2
    node %ACDSL2% remove %2
    exit /b
)

if "%~1"=="--list" (
    echo Executing: node %ACDSL% list
    node %ACDSL2% list
    exit /b
)

if "%~1"=="--set" (
    echo Executing: node %ACDSL% set %2
    node %ACDSL% set %2
    exit /b
)

if "%~1"=="--generate" (
    if "%~2"=="" (
        echo "Usage: --generate <entity-name>"
        exit /b 1
    )
    echo Executing: node %ACDSL% generate %2
    node %ACDSL% %2
    exit /b
)

echo Unknown flag. Usage: --add, --remove, --set, --list, or --generate.
exit /b 1