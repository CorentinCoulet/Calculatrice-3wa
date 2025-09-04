pipeline {
    agent any
    
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
                        sh 'npm ci'
                    } else {
                        bat 'npm ci'
                    }
                }
            }
        }
        
        stage('Lint & Code Quality') {
            steps {
                echo 'Vérification de la qualité du code...'
                script {
                    // Ajouter ici vos outils de linting si vous en avez
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
                    publishTestResults testResultsPattern: 'test-results/junit.xml'
                    
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
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }
        
        stage('Build Docker Image') {
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
                    // Ajouter ici vos outils de scan de sécurité
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
                // Nettoyer les images Docker non utilisées
                if (isUnix()) {
                    sh 'docker system prune -f'
                } else {
                    bat 'docker system prune -f'
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
