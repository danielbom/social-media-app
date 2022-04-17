FROM node:16 as build-env

# Build time
WORKDIR /app 

COPY ./package.json ./yarn.lock ./

RUN yarn install --frozen-lockfile

COPY ./src ./src
COPY ./nest-cli.json ./tsconfig.build.json ./tsconfig.json ./

RUN yarn build

CMD yarn start:prod
