pipeline {
	agent any
	options {
		ansiColor('xterm')
	}
	stages {
		stage('Agent: Node Docker') {
			agent {
				dockerfile {
					filename 'infrastructure/docker/node.dockerfile'
					additionalBuildArgs '--build-arg JENKINS_USER_ID=$(id -u jenkins) --build-arg JENKINS_GROUP_ID=$(id -g jenkins)'
				}
			}
			stages {
				stage('Configure'){
					steps{
						sh """
							rm -f .env
							echo 'CLIENT_SECRET=fake-secret-for-testing' >> .env
							echo 'CLIENT_ID=it.bz.opendatahub.webcomponents.mobility-traffic' >>.env
							echo 'TOKEN_URL=https://auth.opendatahub.bz.it/auth/realms/noi/protocol/openid-connect/token' >>.env
						"""
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
						sh 'npm run build:cdn'
					}
				}
			}
		}
		stage('CC: REUSE') {
			steps {
				sh 'reuse lint'
			}
		}
	}
}
