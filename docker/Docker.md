# Docker

docker run -it -v ${PWD}:/work -w /work alpine:latest /bin/sh
* -it -> interactive container
* -v hostPath:containerPath -> directory map
* -w directory -> working directory

## docker-compose
docker-compose build
    * docker-compose build nodejs
    * docker-compose build python
docker-compose push