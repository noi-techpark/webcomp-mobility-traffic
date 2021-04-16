FROM node:15

ARG JENKINS_GROUP_ID=2000
ARG JENKINS_USER_ID=2000

RUN groupadd --gid $JENKINS_GROUP_ID jenkins && \
    useradd --uid $JENKINS_USER_ID --gid $JENKINS_GROUP_ID --create-home jenkins
