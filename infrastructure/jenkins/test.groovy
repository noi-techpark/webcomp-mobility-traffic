pipeline {
	agent any
	environment {
		DOCKER_IMAGE = "755952719952.dkr.ecr.eu-west-1.amazonaws.com/webcompbuild:latest"
		CLIENT_SECRET = credentials("it.bz.opendatahub.webcomponents.mobility-traffic")
		CLIENT_ID = "it.bz.opendatahub.webcomponents.mobility-traffic"
		TOKEN_URL = "https://auth.opendatahub.bz.it/auth/realms/noi/protocol/openid-connect/token"
	}
	options {
		ansiColor('xterm')
	}
	stages {
		stage('AWS ECR login') {
			steps {
				sh '''
					aws ecr get-login --region eu-west-1 --no-include-email | bash
				'''
			}
		}
		stage('Agent: Docker webcompbuild') {
			agent {
				docker {
					alwaysPull true
					image "${DOCKER_IMAGE}"
				}
			}
			stages {
				stage('Prepare') {
					steps {
						sh '''
							cp /webcompbuild/.env .env
							echo 'CLIENT_SECRET=$CLIENT_SECRET' >> .env
							echo 'CLIENT_ID=$CLIENT_ID' >> .env
							echo 'TOKEN_URL=$TOKEN_URL' >> .env
							rm -rf $(jq -r ".dist.basePath" wcs-manifest.json)
							ln -s "$PWD/node_modules/@stencil/core/bin/stencil" ~/.local/bin/stencil
						'''
					}
				}
				stage("Dependencies") {
					steps {
						sh '''
							npm ci
						'''
					}
				}
				stage('Test') {
					steps {
						sh 'npm run test'
					}
				}				
				stage("Build") {
					steps {
						sh '''
							npm run build:cdn
						'''
					}
				}
				stage("Update manifest") {
					steps {
						sh "/webcompbuild/wcstorecli.sh -u"
					}
				}
				stage('Deploy') {
					steps {
						sshagent (credentials: ['tomcatkey', 'jenkins_github_ssh_key']) {
							sh '''
								cp /webcompbuild/.env .env
								WHEN=$(date "+%Y%m%dT%H%M")
								WC_NAME=${GIT_URL##*/}
								WC_NAME=${WC_NAME%.git}
								/webcompbuild/wcstorecli.sh -d "${WC_NAME}" "${BRANCH_NAME}-${BUILD_NUMBER}-${WHEN}"
							'''
						}
					}
				}
			}
		}
	}
}
