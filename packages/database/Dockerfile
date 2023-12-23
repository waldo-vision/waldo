FROM node:18-alpine3.17 AS builder
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

FROM node:18-alpine3.17 AS runner
# set workdir
WORKDIR /app
ENV NODE_ENV production

# Install infisical
RUN apk add --no-cache bash curl && curl -1sLf \
'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.alpine.sh' | bash \
&& apk add infisical

# Copy node_modules from installer to runner
COPY .yarn/releases .yarn/releases
COPY .yarnrc.yml .yarnrc.yml
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

COPY --from=builder /app/out/full/ .

ENV Mode migrate

ENTRYPOINT ["infisical", "run", "--", "sh", "./packages/database/entrypoint.sh"]
