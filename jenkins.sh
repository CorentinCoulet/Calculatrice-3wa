#!/bin/bash

# Script de gestion Jenkins pour le projet Calculatrice

echo "🚀 Jenkins DevOps Environment - Calculatrice"
echo "==========================================="

case "$1" in
    "start")
        echo "📦 Démarrage de l'environnement Jenkins..."
        docker-compose -f docker-compose.jenkins.yml up -d --build
        echo ""
        echo "✅ Jenkins démarré !"
        echo "🌐 Interface: http://localhost:8080"
        echo "👤 Utilisateur: admin"
        echo "🔑 Mot de passe: admin123"
        echo ""
        echo "⏳ Attendre ~2 minutes pour le démarrage complet..."
        ;;
    
    "stop")
        echo "🛑 Arrêt de l'environnement Jenkins..."
        docker-compose -f docker-compose.jenkins.yml down
        echo "✅ Environnement arrêté !"
        ;;
    
    "restart")
        echo "🔄 Redémarrage de l'environnement..."
        docker-compose -f docker-compose.jenkins.yml restart
        echo "✅ Redémarrage terminé !"
        ;;
    
    "logs")
        echo "📋 Logs Jenkins..."
        docker-compose -f docker-compose.jenkins.yml logs -f jenkins-custom
        ;;
    
    "clean")
        echo "🧹 Nettoyage complet (ATTENTION: supprime toutes les données)..."
        read -p "Êtes-vous sûr ? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose -f docker-compose.jenkins.yml down -v
            docker system prune -f
            echo "✅ Nettoyage terminé !"
        else
            echo "❌ Nettoyage annulé."
        fi
        ;;
    
    "status")
        echo "📊 Statut des services..."
        docker-compose -f docker-compose.jenkins.yml ps
        ;;
    
    *)
        echo "Usage: $0 {start|stop|restart|logs|clean|status}"
        echo ""
        echo "Commandes disponibles:"
        echo "  start   - Démarre l'environnement Jenkins"
        echo "  stop    - Arrête l'environnement"
        echo "  restart - Redémarre les services"
        echo "  logs    - Affiche les logs Jenkins"
        echo "  clean   - Nettoyage complet (supprime tout)"
        echo "  status  - Affiche le statut des services"
        exit 1
        ;;
esac
