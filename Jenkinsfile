pipeline {
    agent any
    
    environment {
        // Variables d'environnement
        NODE_ENV = 'test'
    }
    
    stages {
        stage('🔍 Checkout') {
            steps {
                echo 'Récupération du code source...'
                checkout scm
            }
        }
        
        stage('📦 Install Dependencies') {
            steps {
                echo 'Installation des dépendances Node.js...'
                sh '''
                    echo "Versions installées :"
                    node --version
                    npm --version
                    echo ""
                    echo "Installation des dépendances..."
                    npm ci
                '''
            }
        }
        
        stage('🧪 Run Tests') {
            steps {
                echo 'Exécution des tests unitaires...'
                sh 'npm test'
            }
            post {
                always {
                    // Publier les résultats des tests JUnit
                    junit testResultsPattern: 'test-results/junit.xml', allowEmptyResults: true
                    
                    // Archiver les rapports de tests
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                }
            }
        }
        
        stage('📊 Test Coverage') {
            steps {
                echo 'Génération du rapport de couverture...'
                sh 'npm run test:coverage'
            }
            post {
                always {
                    // Publier le rapport de couverture HTML
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                    
                    // Archiver les rapports de couverture
                    archiveArtifacts artifacts: 'coverage/**/*', allowEmptyArchive: true
                }
            }
        }
        
        stage('🔍 Code Quality') {
            steps {
                echo 'Vérification de la qualité du code...'
                script {
                    // Version simplifiée de vérification de couverture
                    if (fileExists('coverage/lcov-report/index.html')) {
                        echo "✅ Rapport de couverture généré avec succès"
                    } else {
                        echo "⚠️  Pas de rapport de couverture trouvé"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
        
        stage('🚀 Build Application') {
            steps {
                echo 'Construction de l\'application...'
                sh '''
                    echo "Vérification que l'application démarre..."
                    timeout 10s npm start &
                    PID=$!
                    sleep 5
                    if ps -p $PID > /dev/null; then
                        echo "✅ Application démarre correctement"
                        kill $PID
                    else
                        echo "❌ Erreur au démarrage de l'application"
                        exit 1
                    fi
                '''
            }
        }
    }
    
    post {
        always {
            echo '🧹 Nettoyage du workspace...'
            // Nettoyer les node_modules pour économiser l'espace
            sh 'rm -rf node_modules || true'
        }
        success {
            echo '✅ Pipeline exécuté avec succès !'
        }
        failure {
            echo '❌ Pipeline échoué !'
            // Notification d'échec
        }
        unstable {
            echo '⚠️  Pipeline instable (tests passés mais qualité insuffisante)'
        }
    }
}
