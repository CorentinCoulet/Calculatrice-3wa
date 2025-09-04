#!/bin/bash

# Script de déploiement pour Jenkins
# Ce script peut être utilisé dans Jenkins pour automatiser le déploiement

set -e

echo "🚀 Début du déploiement..."

# Variables
PROJECT_NAME="calculatrice"
DOCKER_IMAGE="calculatrice-app"
CONTAINER_NAME="calculatrice-app"

# Fonction pour afficher les logs
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Arrêter et supprimer les conteneurs existants
log "Arrêt des conteneurs existants..."
docker-compose down || true

# Supprimer les images non utilisées
log "Nettoyage des images Docker..."
docker image prune -f

# Construire la nouvelle image
log "Construction de la nouvelle image Docker..."
docker-compose build

# Démarrer les services
log "Démarrage des services..."
docker-compose up -d

# Vérifier que l'application est démarrée
log "Vérification du démarrage de l'application..."
sleep 10

# Test de santé
if curl -f http://localhost:3001/ > /dev/null 2>&1; then
    log "✅ Application déployée avec succès !"
    log "🌐 Application accessible sur http://localhost:3001"
else
    log "❌ Échec du déploiement - L'application ne répond pas"
    exit 1
fi

log "🎉 Déploiement terminé avec succès !"
