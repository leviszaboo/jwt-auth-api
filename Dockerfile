FROM node:18-alpine as base

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

RUN rm -rf dist

EXPOSE 3000

ARG NODE_ENV=$NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; \ 
    then yarn build \
        && rm -rf node_modules \
        && rm -rf config\
        && rm -rf v1 \
        && rm tsconfig.json \
        && mv ./dist/config ./config \
        && yarn install --production; \
    fi

