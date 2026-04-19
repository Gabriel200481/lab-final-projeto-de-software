@echo off
setlocal

if "%~1"=="" (
  echo Uso: scripts\validar_release.cmd CAMINHO_JAVA_HOME
  echo Exemplo: scripts\validar_release.cmd "C:\Program Files\Java\jdk-22"
  exit /b 1
)

set "JAVA_HOME=%~1"
set "PATH=%JAVA_HOME%\bin;%PATH%"

cd /d "%~dp0.."

mvn -Djava.version=22 test
if errorlevel 1 (
  echo Falha na validacao de testes.
  exit /b 1
)

echo Validacao concluida com sucesso.
endlocal
