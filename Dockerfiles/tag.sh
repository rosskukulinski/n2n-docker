# !/bin/sh
docker tag helloworld:latest yourorg/helloworld:$SHA1
docker tag helloworld:latest yourorg/helloworld:$BRANCH_NAME
docker tag helloworld:latest yourorg/build_$BUILD_NUM
docker push yourorg/helloworld:$SHA1
docker push yourorg/helloworld:$BRANCH_NAME
docker push yourorg/build_$BUILD_NUM
