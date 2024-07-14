#!/usr/bin/env bash
# scripts/run-integration.sh

DIR="$(cd "$(dirname "$0")" && pwd)"
source $DIR/setenv.sh
docker compose -f docker-compose.yml -f docker-compose.test.yml up -d

if [ "$#" -eq  "0" ]
  then
    vitest -c ./vitest.config.integration.ts 
else
    vitest -c ./vitest.config.integration.ts --ui
fi