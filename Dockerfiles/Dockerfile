FROM nodesource/node:4
RUN mkdir -p /home/nodejs/app
WORKDIR /home/nodejs/app

# Let's hack around setting up ssh key to clone a private github repo.
RUN mkdir -p /root/.ssh
ADD id_rsa /root/.ssh/id_rsa
RUN chmod 700 /root/.ssh/id_rsa
RUN echo "Host github.com\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config

COPY package.json /home/nodejs/app/package.json
RUN npm install

CMD ["tar", "-czf", "-", "node_modules"]
