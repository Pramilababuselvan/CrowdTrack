@echo off
echo ===================================================
echo Starting CrowdTrack Spring Boot Backend (Port 8080)
echo ===================================================
cd /d "%~dp0public-transport-backend"

set JAVA_HOME=C:\Program Files\Java\jdk-26.0.1
set PATH=%JAVA_HOME%\bin;C:\Program Files\JetBrains\IntelliJ IDEA 2026.2\plugins\maven-plugin\lib\maven3\bin;%PATH%

mvn spring-boot:run
pause
