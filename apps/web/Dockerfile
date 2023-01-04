FROM node:18-alpine AS builder
# ensure deps can build
RUN apk add --update --no-cache openssl1.1-compat libc6-compat
# enable yarn
RUN corepack enable
# set workdir
WORKDIR /app
# copy over entire project
COPY . .
# remove everything not needed for web
RUN yarn dlx -p turbo turbo prune --scope=web --docker
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
RUN yarn turbo run build --filter=web...

FROM node:18-alpine AS runner

# set workdir
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/web/next.config.js .
COPY --from=installer /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

CMD node apps/web/server.js
