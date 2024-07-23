FROM nginx:alpine as base

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

FROM base as prod

COPY ./nginx/prod.conf /etc/nginx/conf.d/default.conf