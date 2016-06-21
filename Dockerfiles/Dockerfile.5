FROM nodesource/node:4

RUN groupadd -r nodejs \
  && useradd -m -r -g nodejs nodejs

USER nodejs

ENV DUMB_INIT_URL https://github.com/Yelp/dumb-init/releases/download/v1.1.1/dumb-init_1.1.1_amd64
RUN wget -O /usr/local/bin/dumb-init ${DUMB_INIT_URL}
RUN chmod +x /usr/local/bin/dumb-init

COPY package.json /home/nodejs/app/package.json
RUN npm install --production
COPY . /home/nodejs/app

CMD ["dumb-init", "node", "index.js"]
