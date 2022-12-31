FROM node:18-alpine AS builder
# ensure deps can build
RUN apk add --update --no-cache openssl1.1-compat libc6-compat
# enable yarn
RUN corepack enable
# set workdir
WORKDIR /app
# copy over entire project
COPY . .
# remove everything not needed for docs
RUN yarn dlx -p turbo turbo prune --scope=docs --docker
# See https://github.com/vercel/turborepo/issues/1997#issuecomment-1271372326
RUN rm -rf /app/out/full/*/*/node_modules

FROM node:18-alpine AS installer
# ensure deps can build
RUN apk add --update --no-cache openssl1.1-compat libc6-compat
# enable yarn
RUN corepack enable
# set workdir
WORKDIR /app

ENV NODE_ENV production

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY .yarn .yarn
COPY .yarnrc.yml .yarnrc.yml
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install --immutable

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN yarn turbo run build --filter=docs...

FROM nginx:1.23 as runner

COPY --from=installer /app/apps/docs/dist /usr/share/nginx/html
# COPY --from=installer /app/apps/docs/nginx.conf /etc/nginx/nginx.conf
