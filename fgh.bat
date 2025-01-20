@echo off
setlocal enabledelayedexpansion

:: Configuração correta do caminho completo
set ACDSL= "%~dp0index.js"

:: Verificar o caminho do Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo O Node.js não está instalado ou não está no PATH.
    exit /b 1
)

:: Checar o comando passado para o script
if "%1"=="" (
    echo Por favor, forneça um comando add, remove, list, generate.
    exit /b 1
)

:: Executar comandos
if "%1"=="add" (
    if "%2"=="" (
        echo "Uso: add <nome-do-template> <caminho-do-template>"
        exit /b 1
    )
    echo Executando: node %ACDSL% add %2 %3
    node %ACDSL% add %2 %3
    exit /b
)

if "%1"=="remove" (
    if "%2"=="" (
        echo "Uso: remove <nome-do-template>"
        exit /b 1
    )
    echo Executando: node %ACDSL% remove %2
    node %ACDSL% remove %2
    exit /b
)

if "%1"=="list" (
    echo Executando: node %ACDSL% list
    node %ACDSL% list
    exit /b
)

if "%1"=="generate" (
    if "%2"=="" (
        echo Uso: generate nome-da-entidade
        exit /b 1
    )

    node %ACDSL% %2

    exit /b
)

echo Comando desconhecido. Uso: add, remove, list ou generate.
exit /b 1
