pipeline {
    agent {
        docker {
            image 'node:18-alpine'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
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
                sh '''
                    echo "Vérification de Node.js..."
                    node --version
                    npm --version
                    echo "Installation des dépendances..."
                    npm ci
                '''
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
                sh 'npm test'
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
                sh 'npm run test:coverage'
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
            agent any // Retourner à l'agent Jenkins principal pour Docker
            when {
                // Seulement si Docker est disponible
                expression { 
                    script {
                        try {
                            sh 'which docker'
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
                sh """
                    docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                    docker build -t ${DOCKER_IMAGE}:latest .
                """
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
            agent any // Retourner à l'agent Jenkins principal pour Docker
            when {
                branch 'develop'
            }
            steps {
                echo 'Déploiement en environnement de test...'
                sh """
                    docker-compose -f docker-compose.yaml down || true
                    docker-compose -f docker-compose.yaml up -d
                """
            }
        }
        
        stage('Deploy to Production') {
            agent any // Retourner à l'agent Jenkins principal pour Docker
            when {
                branch 'main'
            }
            steps {
                echo 'Déploiement en production...'
                input message: 'Déployer en production ?', ok: 'Déployer'
                sh """
                    docker-compose -f docker-compose.yaml down || true
                    docker-compose -f docker-compose.yaml up -d
                """
            }
        }
    }
    
    post {
        always {
            echo 'Nettoyage...'
            script {
                // Nettoyage Docker seulement si Docker est disponible
                try {
                    sh 'docker --version && docker system prune -f || echo "Docker non disponible, skip nettoyage"'
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
