@echo off
setlocal

set "DEFAULT_JAVA_HOME=C:\Users\Gabriel\.jdk\jdk-25"

if "%~1"=="" (
  set "JAVA_HOME=%DEFAULT_JAVA_HOME%"
) else (
  set "JAVA_HOME=%~1"
)

if not exist "%JAVA_HOME%\bin\java.exe" (
  echo JAVA_HOME invalido: "%JAVA_HOME%"
  echo Use o caminho de um JDK 25 valido ou ajuste o DEFAULT_JAVA_HOME no script.
  exit /b 1
)

set "PATH=%JAVA_HOME%\bin;%PATH%"

cd /d "%~dp0.."

mvn -Djava.version=25 test
if errorlevel 1 (
  echo Falha na validacao de testes.
  exit /b 1
)

echo Validacao concluida com sucesso.
endlocal
