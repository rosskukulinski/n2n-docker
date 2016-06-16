FROM nodesource/nsolid:v1.3.1

# libfontconfig is a secret dependency of PhantomJS
# https://github.com/ariya/phantomjs/issues/10904
RUN apt-get -qq update && \
  apt-get -yqq install libfontconfig && \
  apt-get clean

RUN groupadd -r nodejs && useradd -m -r -g nodejs nodejs
USER nodejs

RUN mkdir -p /home/nodejs/app
WORKDIR /home/nodejs/app

COPY package.json /home/nodejs/app/package.json
RUN npm install --production
COPY . /home/nodejs/app

EXPOSE 3000
EXPOSE 8000

ENV NSOLID_APPNAME wayback
ENV NSOLID_HUB nsolid-registry.nsolid:4001
ENV NSOLID_SOCKET 8000
ENV NSOLID_TAGS nsolid-v1.3.1

CMD ["nsolid", "index.js"]
