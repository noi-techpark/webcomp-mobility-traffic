pipeline {
	agent any
	environment {
		DOCKER_IMAGE = "755952719952.dkr.ecr.eu-west-1.amazonaws.com/webcompbuild:latest"
		WC_GIT_REMOTE = get_git_remote()
		WC_GIT_BRANCH = get_git_branch()
		CLIENT_SECRET = credentials("it.bz.opendatahub.webcomponents.mobility-traffic")
		CLIENT_ID = "it.bz.opendatahub.webcomponents.mobility-traffic"
		TOKEN_URL = "https://auth.opendatahub.bz.it/auth/realms/noi/protocol/openid-connect/token"
	}
	options {
		ansiColor('xterm')
	}
	parameters {
		string(name: 'VERSION', defaultValue: '1.0.0', description: 'Version (without a leading "v")', trim: true)
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
				stage('Git Tag') {
					steps {
						sshagent (credentials: ['jenkins_github_ssh_key']) {
							sh '''
								WC_DIST_PATH=$(jq -r ".dist.basePath" wcs-manifest.json)
								mkdir -p ~/.ssh
								ssh-keyscan -H github.com >> ~/.ssh/known_hosts
								git config --global user.email "info@opendatahub.bz.it"
								git config --global user.name "Jenkins"
								git remote set-url ${WC_GIT_REMOTE} ${GIT_URL}
								git add ${WC_DIST_PATH}/*
								git add -A
								git commit --allow-empty -m "Version ${VERSION}"
								git tag --delete v${VERSION} || true
								git push ${WC_GIT_REMOTE} :v${VERSION} || true
								git tag -a v${VERSION} -m "Version ${VERSION}"
								git push ${WC_GIT_REMOTE} HEAD:${WC_GIT_BRANCH}
								git push ${WC_GIT_REMOTE} v${VERSION}
							'''
						}
					}
				}
			}
		}
	}
}



// Helper functions
def get_git_remote() {
	return env.GIT_BRANCH.split('/')[0]
}

def get_git_branch() {
	return env.GIT_BRANCH.split('/')[1]
}
