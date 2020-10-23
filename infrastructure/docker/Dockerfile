FROM node:15-buster as base
ARG JENKINS_GROUP_ID=2000
ARG JENKINS_USER_ID=2000
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 libxtst6\
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
RUN echo 'kernel.unprivileged_userns_clone=1' >  /etc/sysctl.d/00-local-userns.conf
RUN service procps restart
RUN groupadd --gid $JENKINS_GROUP_ID jenkins && \
    useradd --uid $JENKINS_USER_ID --gid $JENKINS_GROUP_ID --create-home jenkins

FROM base as dev
WORKDIR /

FROM base as build
COPY . .
