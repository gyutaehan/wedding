pipeline {
    agent any

    tools {
        nodejs 'NodeJS 20' 
    }

    environment {
        VITE_APP_VERSION = 'somi'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build (Somi Version)') {
            steps {
                withCredentials([string(credentialsId: 'FIREBASE_API_KEY', variable: 'VITE_FIREBASE_API_KEY')]) {
                    sh 'npm run build'
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
            }
        }
    }
}