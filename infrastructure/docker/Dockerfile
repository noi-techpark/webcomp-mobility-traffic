# Do not remove, we need it for Jenkinsfile-CI.groovy
FROM node:12

ARG JENKINS_GROUP_ID=1000
ARG JENKINS_USER_ID=1000

RUN groupadd --gid $JENKINS_GROUP_ID jenkins && \
    useradd --uid $JENKINS_USER_ID --gid $JENKINS_GROUP_ID --create-home jenkins && \
    apt update && \
    apt install -y jq && \
    rm -rf /var/lib/apt/lists/*
