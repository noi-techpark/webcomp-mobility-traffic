pipeline {
    agent {
        dockerfile {
            filename 'infrastructure/docker/Dockerfile'
            additionalBuildArgs '--build-arg JENKINS_USER_ID=`id -u jenkins` --build-arg JENKINS_GROUP_ID=`id -g jenkins`'
            args '--cap-add=SYS_ADMIN'
        }
    }
    environment{
        CLIENT_SECRET=credentials('webcomp-mobility-traffic_client-secret')
    }
    stages {
        stage('Configure'){
            steps{
                sh "echo 'CLIENT_SECRET=${CLIENT_SECRET}'>> .env"
                sh "echo 'CLIENT_ID=it.bz.opendatahub.webcomponents.mobility-traffic' >>.env"
                sh """echo 'TOKEN_URL="https://auth.opendatahub.bz.it/auth/realms/noi/protocol/openid-connect/token' >>.env"""
            }
        }
        stage('Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        stage('Test') {
            steps {
                sh 'npm run test'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}