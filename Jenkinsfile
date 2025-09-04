pipeline {
    agent any
    
    tools {
        // Utilise l'installation NodeJS configurée dans Jenkins
        nodejs 'NodeJS-18'
    }
    
    environment {
        // Variables d'environnement
        NODE_VERSION = '18'
        DOCKER_IMAGE = 'calculatrice-app'
        DOCKER_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Récupération du code source...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installation des dépendances Node.js...'
                script {
                    if (isUnix()) {
                        sh 'node --version'
                        sh 'npm --version'
                        sh 'npm ci'
                    } else {
                        bat 'node --version'
                        bat 'npm --version'
                        bat 'npm ci'
                    }
                }
            }
        }
        
        stage('Lint & Code Quality') {
            steps {
                echo 'Vérification de la qualité du code...'
                script {
                    echo 'Étape de linting à configurer'
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                echo 'Exécution des tests...'
                script {
                    if (isUnix()) {
                        sh 'npm test'
                    } else {
                        bat 'npm test'
                    }
                }
            }
            post {
                always {
                    // Publier les résultats des tests JUnit
                    script {
                        if (fileExists('test-results/junit.xml')) {
                            publishTestResults testResultsPattern: 'test-results/junit.xml'
                        } else {
                            echo 'Aucun fichier de résultats de tests trouvé'
                        }
                    }
                    
                    // Archiver les rapports de tests
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                }
            }
        }
        
        stage('Test Coverage') {
            steps {
                echo 'Génération du rapport de couverture...'
                script {
                    if (isUnix()) {
                        sh 'npm run test:coverage'
                    } else {
                        bat 'npm run test:coverage'
                    }
                }
            }
            post {
                always {
                    // Publier le rapport de couverture
                    script {
                        if (fileExists('coverage/lcov-report/index.html')) {
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'coverage/lcov-report',
                                reportFiles: 'index.html',
                                reportName: 'Coverage Report'
                            ])
                        } else {
                            echo 'Aucun rapport de couverture trouvé'
                        }
                    }
                }
            }
        }
        
        stage('Build Docker Image') {
            when {
                // Seulement si Docker est disponible
                expression { 
                    script {
                        try {
                            if (isUnix()) {
                                sh 'which docker'
                            } else {
                                bat 'where docker'
                            }
                            return true
                        } catch (Exception e) {
                            echo "Docker non disponible, étape ignorée"
                            return false
                        }
                    }
                }
            }
            steps {
                echo 'Construction de l\'image Docker...'
                script {
                    if (isUnix()) {
                        sh """
                            docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                            docker build -t ${DOCKER_IMAGE}:latest .
                        """
                    } else {
                        bat """
                            docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                            docker build -t ${DOCKER_IMAGE}:latest .
                        """
                    }
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                echo 'Analyse de sécurité...'
                script {
                    echo 'Étape de scan de sécurité à configurer'
                }
            }
        }
        
        stage('Deploy to Test') {
            when {
                branch 'develop'
            }
            steps {
                echo 'Déploiement en environnement de test...'
                script {
                    if (isUnix()) {
                        sh """
                            docker-compose -f docker-compose.yaml down || true
                            docker-compose -f docker-compose.yaml up -d
                        """
                    } else {
                        bat """
                            docker-compose -f docker-compose.yaml down
                            docker-compose -f docker-compose.yaml up -d
                        """
                    }
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                echo 'Déploiement en production...'
                input message: 'Déployer en production ?', ok: 'Déployer'
                script {
                    if (isUnix()) {
                        sh """
                            docker-compose -f docker-compose.yaml down || true
                            docker-compose -f docker-compose.yaml up -d
                        """
                    } else {
                        bat """
                            docker-compose -f docker-compose.yaml down
                            docker-compose -f docker-compose.yaml up -d
                        """
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Nettoyage...'
            script {
                // Nettoyage Docker seulement si Docker est disponible
                try {
                    if (isUnix()) {
                        sh 'docker --version && docker system prune -f || echo "Docker non disponible, skip nettoyage"'
                    } else {
                        bat 'docker --version && docker system prune -f || echo "Docker non disponible, skip nettoyage"'
                    }
                } catch (Exception e) {
                    echo "Docker non disponible pour le nettoyage: ${e.getMessage()}"
                }
            }
        }
        success {
            echo 'Pipeline exécuté avec succès ! ✅'
        }
        failure {
            echo 'Pipeline échoué ! ❌'
        }
        unstable {
            echo 'Pipeline instable ! ⚠️'
        }
    }
}
