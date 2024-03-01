FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

RUN rm -rf dist

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

EXPOSE 3000
