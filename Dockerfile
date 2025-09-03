# Utilise l'image officielle Node.js comme base
FROM node:18-alpine AS base

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers package.json et package-lock.json (si disponible)
COPY package*.json ./

# Stage pour les dépendances de développement (tests)
FROM base AS dev-deps
RUN npm ci

# Stage pour les tests
FROM dev-deps AS test
COPY . .
CMD ["npm", "test"]

# Stage pour la production
FROM base AS production
RUN npm ci --only=production && npm cache clean --force

# Copie le code source de l'application
COPY . .

# Ajoute un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change la propriété des fichiers
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose le port sur lequel l'application s'exécute
EXPOSE 3001

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3001

# Définit la commande par défaut pour démarrer l'application
CMD ["npm", "start"]
