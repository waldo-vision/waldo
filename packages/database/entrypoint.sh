#!/bin/sh
set -ex

# check if arg provided
if [ -z "${Mode}" ]; then
    echo "No argument supplied"
    exit 1
fi

if [ ${Mode} = migrate ]; then
    echo "Migrating database..."
    yarn workspace database prisma migrate deploy

    echo : "Generate Prisma Client..."
    yarn workspace database prisma generate

    echo "Seed database..."
    yarn workspace database prisma db seed
elif [ ${Mode} = studio ]; then
    yarn workspace database prisma studio
fi
