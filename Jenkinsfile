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
                echo 'Vérification de l\'environnement...'
                script {
                    // Vérifier si Node.js est disponible
                    try {
                        sh 'node --version'
                        sh 'npm --version'
                        echo 'Node.js est disponible, installation des dépendances...'
                        sh 'npm ci'
                    } catch (Exception e) {
                        echo "Node.js non disponible: ${e.getMessage()}"
                        echo "Installation des dépendances ignorée"
                        currentBuild.result = 'UNSTABLE'
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
            when {
                expression {
                    script {
                        try {
                            sh 'node --version'
                            return true
                        } catch (Exception e) {
                            echo "Node.js non disponible, tests ignorés"
                            return false
                        }
                    }
                }
            }
            steps {
                echo 'Exécution des tests...'
                script {
                    try {
                        sh 'npm test'
                    } catch (Exception e) {
                        echo "Erreur lors des tests: ${e.getMessage()}"
                        currentBuild.result = 'UNSTABLE'
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
            when {
                expression {
                    script {
                        try {
                            sh 'node --version'
                            return true
                        } catch (Exception e) {
                            echo "Node.js non disponible, couverture ignorée"
                            return false
                        }
                    }
                }
            }
            steps {
                echo 'Génération du rapport de couverture...'
                script {
                    try {
                        sh 'npm run test:coverage'
                    } catch (Exception e) {
                        echo "Erreur lors de la génération de couverture: ${e.getMessage()}"
                        currentBuild.result = 'UNSTABLE'
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
            agent any // Retourner à l'agent Jenkins principal pour Docker
            when {
                // Seulement si Docker est disponible
                expression { 
                    script {
                        try {
                            sh 'docker --version'
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
                    try {
                        sh """
                            docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                            docker build -t ${DOCKER_IMAGE}:latest .
                        """
                    } catch (Exception e) {
                        echo "Erreur lors de la construction Docker: ${e.getMessage()}"
                        currentBuild.result = 'UNSTABLE'
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
            agent any // Retourner à l'agent Jenkins principal pour Docker
            when {
                allOf {
                    branch 'develop'
                    expression {
                        script {
                            try {
                                sh 'docker --version'
                                return true
                            } catch (Exception e) {
                                echo "Docker non disponible, déploiement ignoré"
                                return false
                            }
                        }
                    }
                }
            }
            steps {
                echo 'Déploiement en environnement de test...'
                script {
                    try {
                        sh """
                            docker-compose -f docker-compose.yaml down || true
                            docker-compose -f docker-compose.yaml up -d
                        """
                    } catch (Exception e) {
                        echo "Erreur lors du déploiement test: ${e.getMessage()}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
        
        stage('Deploy to Production') {
            agent any // Retourner à l'agent Jenkins principal pour Docker
            when {
                allOf {
                    branch 'main'
                    expression {
                        script {
                            try {
                                sh 'docker --version'
                                return true
                            } catch (Exception e) {
                                echo "Docker non disponible, déploiement ignoré"
                                return false
                            }
                        }
                    }
                }
            }
            steps {
                echo 'Déploiement en production...'
                input message: 'Déployer en production ?', ok: 'Déployer'
                script {
                    try {
                        sh """
                            docker-compose -f docker-compose.yaml down || true
                            docker-compose -f docker-compose.yaml up -d
                        """
                    } catch (Exception e) {
                        echo "Erreur lors du déploiement production: ${e.getMessage()}"
                        currentBuild.result = 'UNSTABLE'
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
                    sh 'docker --version > /dev/null 2>&1 && docker system prune -f || echo "Docker non disponible, skip nettoyage"'
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
