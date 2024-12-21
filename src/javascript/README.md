# Javascript Implementation of React Query Builder Rule Engine

## Unit Tests
The following shell commands will execute the unit tests:

```shell
npm install -g tape
tape test/*.js
```

## Node Docker Container
Rather than installing [node](https://nodejs.org/en) on your development computer, we recommend using node from within
a Docker container. To support this strategy, use the `node-docker-compose.yml` file:

```shell
docker-compose -f ./node-docker-compose.yml run app /bin/bash
```

A typical use case for using the node Docker container is to execute `node` and/or `npm` commands.
