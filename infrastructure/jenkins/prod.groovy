pipeline {
    agent {
        dockerfile {
            filename 'infrastructure/docker/dockerfile'
            additionalBuildArgs '--build-arg JENKINS_USER_ID=$(id -u jenkins) --build-arg JENKINS_GROUP_ID=$(id -g jenkins)'
        }
    }

    options {
        ansiColor('xterm')
    }

    parameters {
        string(name: 'VERSION', defaultValue: '1.0.0', description: 'Version (without a leading "v")', trim: true)
    }

    environment {
        WC_GIT_REMOTE = get_git_remote()
        WC_GIT_BRANCH = get_git_branch()
        WC_DIST_PATH = "cdn/noi"

        CLIENT_SECRET = credentials("it.bz.opendatahub.webcomponents.mobility-traffic")
        CLIENT_ID = "it.bz.opendatahub.webcomponents.mobility-traffic"
        TOKEN_URL = "https://auth.opendatahub.bz.it/auth/realms/noi/protocol/openid-connect/token"
    }

    stages {
        stage('Clean') {
            steps {
                sh 'rm -rf "$WC_DIST_PATH"'
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
        stage('Git Tag') {
            steps {
                sshagent (credentials: ['jenkins_github_ssh_key']) {
                    sh """
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
                    """
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
