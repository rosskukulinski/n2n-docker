FROM nodesource/node:4

RUN groupadd -r nodejs \
  && useradd -m -r -g nodejs nodejs

USER nodejs

RUN mkdir -p /home/nodejs/app
WORKDIR /home/nodejs/app

COPY package.json /home/nodejs/app/package.json
RUN npm install --production
COPY . /home/nodejs/app

ENV NODE_ENV production

CMD ["node", "index.js"]
