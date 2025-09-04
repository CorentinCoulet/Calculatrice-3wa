@echo off
REM Script de gestion Jenkins pour Windows

echo 🚀 Jenkins DevOps Environment - Calculatrice
echo ===========================================

if "%1"=="start" (
    echo 📦 Démarrage de l'environnement Jenkins...
    docker-compose -f docker-compose.jenkins.yml up -d --build
    echo.
    echo ✅ Jenkins démarré !
    echo 🌐 Interface: http://localhost:8080
    echo 👤 Utilisateur: admin
    echo 🔑 Mot de passe: admin123
    echo.
    echo ⏳ Attendre ~2 minutes pour le démarrage complet...
    goto :eof
)

if "%1"=="stop" (
    echo 🛑 Arrêt de l'environnement Jenkins...
    docker-compose -f docker-compose.jenkins.yml down
    echo ✅ Environnement arrêté !
    goto :eof
)

if "%1"=="restart" (
    echo 🔄 Redémarrage de l'environnement...
    docker-compose -f docker-compose.jenkins.yml restart
    echo ✅ Redémarrage terminé !
    goto :eof
)

if "%1"=="logs" (
    echo 📋 Logs Jenkins...
    docker-compose -f docker-compose.jenkins.yml logs -f jenkins-custom
    goto :eof
)

if "%1"=="clean" (
    echo 🧹 Nettoyage complet (ATTENTION: supprime toutes les données)...
    set /p choice="Êtes-vous sûr ? (y/N): "
    if /i "%choice%"=="y" (
        docker-compose -f docker-compose.jenkins.yml down -v
        docker system prune -f
        echo ✅ Nettoyage terminé !
    ) else (
        echo ❌ Nettoyage annulé.
    )
    goto :eof
)

if "%1"=="status" (
    echo 📊 Statut des services...
    docker-compose -f docker-compose.jenkins.yml ps
    goto :eof
)

echo Usage: %0 {start^|stop^|restart^|logs^|clean^|status}
echo.
echo Commandes disponibles:
echo   start   - Démarre l'environnement Jenkins
echo   stop    - Arrête l'environnement
echo   restart - Redémarre les services
echo   logs    - Affiche les logs Jenkins
echo   clean   - Nettoyage complet (supprime tout)
echo   status  - Affiche le statut des services
