FROM node:20-alpine3.16 as base

WORKDIR /app

COPY package.json .
COPY yarn.lock .

COPY prisma ./prisma/ 

RUN yarn install

COPY . .

RUN rm -rf dist

EXPOSE 3000

FROM base as prod

RUN yarn build
RUN rm -rf node_modules
RUN rm -rf config
RUN rm -rf v1
RUN rm tsconfig.json
RUN mv ./dist/config ./config
RUN yarn install --production

RUN npx prisma migrate

CMD ["yarn", "start"]


