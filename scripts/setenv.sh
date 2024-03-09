#!/usr/bin/env bash
# scripts/setenv.sh

# Export DATABASE_URL
export DATABASE_URL=$(grep -v '^#' .env | grep '^DATABASE_URL=' | cut -d '=' -f 2-)

# Export POSTGRES_PASSWORD
export POSTGRES_PASSWORD=$(grep -v '^#' .env | grep '^POSTGRES_PASSWORD=' | cut -d '=' -f 2-)
