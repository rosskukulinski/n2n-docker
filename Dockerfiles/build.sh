# !/bin/sh
docker build -t myapp-build -f Dockerfile.build .
docker run myapp-build > node_modules.tar.gz
docker build -t myapp -f Dockerfile.dist .
