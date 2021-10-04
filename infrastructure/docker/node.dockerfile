FROM node:15

ARG JENKINS_GROUP_ID=2000
ARG JENKINS_USER_ID=2000

ENV PATH="${PATH}:./node_modules/@stencil/core/bin"

RUN groupadd --gid $JENKINS_GROUP_ID jenkins && \
    useradd --uid $JENKINS_USER_ID --gid $JENKINS_GROUP_ID --create-home jenkins && \
    apt-get update && \
    apt-get -y upgrade && \
    apt-get -y install --no-install-recommends jq && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
	echo "export PATH=$PATH" >> /home/jenkins/.bashrc
