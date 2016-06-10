FROM nodesource/node:4
RUN groupadd -r nodejs \
  && useradd -m -r -g nodejs nodejs
USER nodejs
RUN mkdir -p /home/nodejs/app
WORKDIR /home/nodejs/app

ADD node_modules.tar.gz /home/nodejs/app
COPY . /home/nodejs/app

ENV NODE_ENV production

CMD ["node", "index.js"]
