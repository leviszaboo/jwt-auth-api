#!/usr/bin/env bash
# scripts/setenv.sh

# Export DATABASE_URL
export DATABASE_URL=$(grep -v '^#' .env | grep '^DATABASE_URL=' | cut -d '=' -f 2-)
