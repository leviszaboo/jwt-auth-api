#!/usr/bin/env bash
# scripts/run-integration.sh

DIR="$(cd "$(dirname "$0")" && pwd)"
source $DIR/setenv.sh
docker compose -f docker-compose.yml -f docker-compose.test.yml up -d
echo '🟡 - Testing database connection...'
PGPASSWORD=$POSTGRES_PASSWORD psql -h localhost -p 5432 -U postgres -c 'SELECT 1;' > /dev/null
echo '🟢 - Database connection is ready!'
if [ "$#" -eq  "0" ]
  then
    vitest run -c ./vitest.config.integration.ts
else
    vitest -c ./vitest.config.integration.ts --ui
fi