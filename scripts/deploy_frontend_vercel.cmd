@echo off
setlocal

if "%~1"=="" (
  echo Uso: scripts\deploy_frontend_vercel.cmd SEU_TOKEN_VERCEL
  exit /b 1
)

set "VERCEL_TOKEN=%~1"

cd /d "%~dp0.."

npx -y vercel@51.7.0 --prod --yes --token "%VERCEL_TOKEN%"
if errorlevel 1 (
  echo Falha no deploy Vercel.
  exit /b 1
)

echo Deploy Vercel concluido com sucesso.
endlocal
