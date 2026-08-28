#!/usr/bin/env bash
# Copy the remote D1 Post table into the local D1 database used by `npm run dev`.
set -euo pipefail

DB_NAME="portfolio-db"
DUMP="tmp/d1-remote-posts.sql"

mkdir -p tmp

echo "→ Exporting Post rows from remote $DB_NAME"
npx wrangler d1 export "$DB_NAME" --remote --table Post --no-schema --output "$DUMP" -y

echo "→ Applying local migrations"
npx wrangler d1 migrations apply "$DB_NAME" --local

echo "→ Clearing local Post table"
npx wrangler d1 execute "$DB_NAME" --local --command "DELETE FROM Post" -y

echo "→ Importing rows into local $DB_NAME"
npx wrangler d1 execute "$DB_NAME" --local --file "$DUMP" -y

echo "→ Local row count"
npx wrangler d1 execute "$DB_NAME" --local --command "SELECT COUNT(*) AS count FROM Post" -y
