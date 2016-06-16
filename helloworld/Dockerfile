FROM nodesource/nsolid:v1.3.1

RUN groupadd -r nodejs && useradd -m -r -g nodejs nodejs
USER nodejs

RUN mkdir -p /home/nodejs/app
WORKDIR /home/nodejs/app

COPY package.json /home/nodejs/app/package.json
RUN npm install --production
COPY . /home/nodejs/app

EXPOSE 3000
EXPOSE 8000

ENV NSOLID_APPNAME helloworld
ENV NSOLID_HUB nsolid-registry.nsolid:4001
ENV NSOLID_SOCKET 8000
ENV NSOLID_TAGS nsolid-v1.3.1

CMD ["node", "index.js"]
