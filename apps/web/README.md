# WALDO App

This is the monolithic NextJS app deployed at https://waldo.vision.

## Getting Started

The easiest way to get started with Waldo is to build and run the app locally. This process is fairly straight forward.

### Install Dependencies

You'll need to install a few dependencies in order to run the dev server:

- [yarn](https://yarnpkg.com/getting-started/install) - our JavaScript package manager.
- [docker](https://docs.docker.com/engine/install/) - used for building and running containers.

With those installed, you can download additional packages with yarn:

```bash
yarn install
```

### Configuration

The app is configured via environment variables stored within a `.env` file in this directory.

Start by copying the example env file.

```bash
cp apps/web/.env.example apps/web/.env

# Open the file
vim apps/web/.env
```

Then configure the variables in this file.

#### Discord

If you plan on authenticating to Discord, make sure these credentials are set.

- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`

Follow [this guide](https://discordjs.guide/oauth2/#getting-an-oauth2-url) until you have added the `Redirect URL`. Be sure to set this to `http://localhost:3000/api/auth/callback/discord`.

#### GitHub

If you plan on authenticating to GitHub, make sure these credentials are set.

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

Follow [this guide](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app). Be sure to set the `Callback URL` to `http://localhost:3000/api/auth/callback/github`.

#### Next Auth

Be sure to also set the `NEXTAUTH_URL` variable.

- `NEXTAUTH_URL=http://localhost:3000`.

#### CloudFlare Turnstile

_TODO: add CloudFlare configuration docs_

#### Youtube

_TODO: add Youtube configuration docs_

### CockroachDB

The primary database used by the app is CockroachDB. You will need a working server to run this app locally.

#### Hosting

You can easily spin up a new CockroachDB container with the `docker-compose` file at the root of this repo.

```bash
docker-compose up -d

# Check that the server is running
docker ps
```

Alternatively, you can use CockroachDB's free [serverless tier](https://www.cockroachlabs.com/get-started-cockroachdb/) if you don't wish to self-host.

#### Configuration

You will now need to set the `DATABASE_URL` variable in two configuration files:

- `apps/web/.env`
- `packages/database/.env`. If you haven't already, create this file with `cp packages/database/.env.example packages/database/.env`.

If self-hosting using the docker-compose method, then set `DATABASE_URL="postgresql://root@localhost:26257?sslmode=disable"` in each of these files.

#### Migration

With your configuration set, you should be ready to run the migrations needed for our ORM to work.

```bash
yarn turbo db:generate
yarn turbo run db:push
```

### Starting the server

With your environment configured, you should be ready to start the dev server.

```bash
yarn workspace web dev
```

Alternatively, you can build an optimized deployment of the app and deploy that instead.

```bash
# Build the app
yarn workspace web build

# Serve the app
yarn workspace web start
```

You should now be able to visit the website at http://localhost:3000.
