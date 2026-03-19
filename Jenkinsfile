pipeline {
    agent any

    tools {
        nodejs 'NodeJS 20' 
    }

    stages {
        // 1. 공통 작업: 코드 가져오고 패키지 설치
        stage('Checkout & Setup') {
            steps {
                checkout scm
                sh 'npm ci'
            }
        }

        // 2. Somi 버전 빌드 및 배포
        stage('Deploy: Somi Version') {
            environment {
                VITE_APP_VERSION = 'somi'
                VITE_BASE_URL = '/wedding/'
            }
            steps {
                withCredentials([string(credentialsId: 'FIREBASE_API_KEY', variable: 'VITE_FIREBASE_API_KEY')]) {
                    sh 'npm run build'
                }
                // 이전 파일 삭제 후 새 파일 복사
                sh 'rm -rf /deploy_somi/*'
                sh 'cp -r dist/* /deploy_somi/'
                echo '✅ Somi 버전 배포 완료!'
            }
        }

        // 3. Common 버전 빌드 및 배포
        stage('Deploy: Common Version') {
            environment {
                VITE_APP_VERSION = 'common'
                VITE_BASE_URL = '/'
            }
            steps {
                withCredentials([string(credentialsId: 'FIREBASE_API_KEY', variable: 'VITE_FIREBASE_API_KEY')]) {
                    sh 'npm run build'
                }
                sh 'rm -rf /deploy_common/*'
                sh 'cp -r dist/* /deploy_common/'
                echo '✅ Common 버전 배포 완료!'
            }
        }

        // 4. Fath 버전 빌드 및 배포
        stage('Deploy: Fath Version') {
            environment {
                VITE_APP_VERSION = 'fath'
                VITE_BASE_URL = '/wedding/'
            }
            steps {
                withCredentials([string(credentialsId: 'FIREBASE_API_KEY', variable: 'VITE_FIREBASE_API_KEY')]) {
                    sh 'npm run build'
                }
                sh 'rm -rf /deploy_fath/*'
                sh 'cp -r dist/* /deploy_fath/'
                echo '✅ Fath 버전 배포 완료!'
            }
        }
    }
}