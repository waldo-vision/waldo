FROM node:18-alpine AS builder
# ensure deps can build
RUN apk add --update --no-cache openssl1.1-compat libc6-compat
# enable yarn
RUN corepack enable
# set workdir
WORKDIR /app
# copy over entire project
COPY . .
# remove everything not needed for database
RUN yarn dlx -p turbo turbo prune --scope=database --docker
# See https://github.com/vercel/turborepo/issues/1997#issuecomment-1271372326
RUN rm -rf /app/out/full/*/*/node_modules

FROM node:18-alpine AS runner
# set workdir
WORKDIR /app
ENV NODE_ENV production
# Copy node_modules from installer to runner
COPY --from=builder /app/out/full/ .
COPY .yarn .yarn
COPY .yarnrc.yml .yarnrc.yml
# Set workdir
WORKDIR /app/packages/database/
ENTRYPOINT yarn dlx prisma migrate deploy
