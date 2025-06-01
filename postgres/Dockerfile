FROM postgres

COPY ./postgres/init.sql /docker-entrypoint-initdb.d/init.sql

RUN chown postgres:postgres /docker-entrypoint-initdb.d/init.sql