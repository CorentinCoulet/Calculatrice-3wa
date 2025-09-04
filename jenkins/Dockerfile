# Dockerfile Jenkins personnalisé avec Node.js et plugins
FROM jenkins/jenkins:lts

# Passer en mode root pour installer des packages
USER root

# Installer Node.js 18.x
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Installer Docker CLI (pour construire des images depuis Jenkins)
RUN apt-get update && \
    apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && \
    apt-get install -y docker-ce-cli

# Retourner à l'utilisateur jenkins
USER jenkins

# Installer les plugins Jenkins automatiquement (versions compatibles)
RUN jenkins-plugin-cli --plugins \
    nodejs:1.6.1 \
    workflow-aggregator:596.v8c21c963d92d \
    git:5.2.2 \
    junit:1265.v65b_14fa_f12f0 \
    htmlpublisher:1.36

# Configuration automatique de Node.js
COPY jenkins-config/ /usr/share/jenkins/ref/

# Skip setup wizard
ENV JAVA_OPTS="-Djenkins.install.runSetupWizard=false"

# Exposer les ports
EXPOSE 8080 50000
