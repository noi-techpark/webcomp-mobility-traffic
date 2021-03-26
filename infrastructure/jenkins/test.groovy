pipeline {
    agent {
        docker {
			image '755952719952.dkr.ecr.eu-west-1.amazonaws.com/webcompbuild:latest'
		}
    }
    options {
        ansiColor('xterm')
    }
    environment {
		WC_DIST_PATH = "cdn/noi"
        CLIENT_SECRET = credentials("it.bz.opendatahub.webcomponents.mobility-traffic")
        CLIENT_ID = "it.bz.opendatahub.webcomponents.mobility-traffic"
        TOKEN_URL = "https://auth.opendatahub.bz.it/auth/realms/noi/protocol/openid-connect/token"
    }
    stages {
        stage('Prepare') {
            steps {
                sh '''
					cp /webcompbuild/.env .env
                    rm -rf $(jq -r ".dist.basePath" wcs-manifest.json)
					echo "HEREMAP_API_KEY=$HEREMAP_API_KEY" >> .env
                '''
            }
        }
        stage('Test') {
            steps {
                sh 'npm run test'
            }
        }
        stage('Configure') {
            steps {
                sh """
                    rm -rf .env
                    echo 'CLIENT_SECRET=$CLIENT_SECRET' >> .env
                    echo 'CLIENT_ID=$CLIENT_ID' >> .env
                    echo 'TOKEN_URL=$TOKEN_URL' >> .env
                """
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build:cdn'
            }
        }
        stage('Update wcs-manifest.json') {
            steps {
                sh """
                    ls "$WC_DIST_PATH/" | jq -R -s -c 'split("\\n")[:-1]' | jq '.' > files-list.json
                    jq '.dist.files = input' wcs-manifest.json files-list.json > wcs-manifest-tmp.json
                    mv wcs-manifest-tmp.json wcs-manifest.json
                    rm -f files-list.json
                """
            }
        }
		stage('Deploy to Test Store') {
			steps {
				sshagent (credentials: ['tomcatkey', 'jenkins_github_ssh_key']) {
					sh '''
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
