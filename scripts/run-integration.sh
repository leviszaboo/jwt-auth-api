#!/usr/bin/env bash
# scripts/run-integration.sh

# Export DATABASE_URL
export DATABASE_URL=$(grep -v '^#' .env.test | grep '^DATABASE_URL=' | cut -d '=' -f 2-)

# Export POSTGRES_PASSWORD
export POSTGRES_PASSWORD=$(grep -v '^#' .env.test | grep '^POSTGRES_PASSWORD=' | cut -d '=' -f 2-)

export NODE_ENV='test'

docker compose -f docker-compose.yml -f docker-compose.test.yml up -d

if [ "$#" -eq  "0" ]
  then
    vitest -c ./vitest.config.integration.ts 
else
    vitest -c ./vitest.config.integration.ts --ui
fi