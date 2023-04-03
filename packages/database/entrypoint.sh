#!/bin/sh
set -ex

echo "Migrating database..."
yarn workspace database prisma migrate deploy

echo : "Generate Prisma Client..."
yarn workspace database prisma generate

echo "Seed database..."
yarn workspace database prisma db seed
