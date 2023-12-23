FROM node:18-alpine3.17 AS builder
# ensure deps can build
# prisma
RUN apk add --update --no-cache openssl1.1-compat libc6-compat
# node-gyp
RUN apk add --update --no-cache g++ gcc libgcc libstdc++ linux-headers make python3
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

FROM node:18-alpine3.17 AS installer
# ensure deps can build
# prisma
RUN apk add --update --no-cache openssl1.1-compat libc6-compat
# node-gyp
RUN apk add --update --no-cache g++ gcc libgcc libstdc++ linux-headers make python3
# enable yarn
RUN corepack enable
# set workdir
WORKDIR /app

ENV NODE_ENV production
ARG NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY 1x00000000000000000000AA

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY .yarn .yarn
COPY .yarnrc.yml .yarnrc.yml
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN yarn turbo run build --filter=web...

FROM node:18-alpine3.17 AS runner

# set workdir
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV INFISICAL_ENV prod
ENV INFISICAL_DISABLE_UPDATE_CHECK true

# Install infisical
RUN apk add --no-cache bash curl && curl -1sLf \
'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.alpine.sh' | bash \
&& apk add infisical

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/web/next.config.js .
COPY --from=installer /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

CMD ["infisical", "run", "--env", "${INFISICAL_ENV}", "--", "node", "apps/web/server.js"]
