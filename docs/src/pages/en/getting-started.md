---
title: Getting Started
description: Getting started with contributing to Waldo Vision
layout: ../../layouts/MainLayout.astro
---

## Prerequisites

Before you can start hacking away on waldo, you need to have the tools below to ensure everything works.

- Node.js - The current `LTS` version
- Rust - So our desktop app can build
- Yarn - Our package manager of choice

## Deploying Services

Waldo Vision is dependent on a number of services, and depending on your needs, you can either self host, or use a cloud option for all of them. We recommend you self host for ease of development, but the cloud options do exist if you wish to use them.

## Setting Up A Local Deployment

First, clone the git repo `https://github.com/waldo-vision/waldo` to your machine then navigate to it using the 'cd' console command.

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

#### Discord

If you plan on authenticating to Discord, make sure these credentials are set.

- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`

Follow [this guide](https://discordjs.guide/oauth2/#getting-an-oauth2-url) until you have added the `Redirect URL`. Be sure to set this to `http://localhost:3000/api/auth/callback/discord`.

Update your .env file like so:

```.env
DISCORD_CLIENT_ID="57324592435671234019234"
DISCORD_CLIENT_SECRET="342759ASDa82dsaf345-ADHFUFA"
```

#### GitHub

If you plan on authenticating to GitHub, make sure these credentials are set.

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

Follow [this guide](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app). Be sure to set the `Callback URL` to `http://localhost:3000/api/auth/callback/github`.

Update your .env file like so:

```.env
GITHUB_CLIENT_ID="7482521243341245243"
GITHUB_CLIENT_SECRET="FDGNJO3490TNGFMGDSK"
```

#### Next Auth

Be sure to also set the `NEXTAUTH_URL` variable.

- `NEXTAUTH_URL=http://localhost:3000`.

#### CloudFlare Turnstile

_TODO: add CloudFlare configuration docs_

You may also want to set the `Cloudflare Turnstile` keys so that submissions work.

#### Youtube

_TODO: add Youtube configuration docs_

You may also want to set the `Youtube API Key` so that the review site works properly.

_Note: YT API Key needs to be `version 3` of the api._

### CockroachDB

The primary database used by the app is CockroachDB. You will need a working server to run this app locally.

#### Hosting

You can easily spin up a new CockroachDB container with the `docker compose` file at the root of this repo.

```bash
# start the container
docker compose up -d

# Check that the container is running
docker ps

# If at any point you wish to shut down the container:
docker compose down
```

Alternatively, you can use CockroachDB's free [serverless tier](https://www.cockroachlabs.com/get-started-cockroachdb/) if you don't wish to self-host.

Option for Windows Users:

- <span style="color:red; font-weight: bold">WARNING: Not recommended for development, use at your own risk, no support provided</span>.
- For Windows you can download the Beta Archive from [Cockroachlabs](https://www.cockroachlabs.com/docs/stable/install-cockroachdb-windows.html)
  and run the exe with `./cockroach.exe start-single-node --insecure`
- Then set the `DATABASE_URL` variable in `/packages/database/.env` and `/packages/web/.env` to the url displayed on start for postgresql
- You even have a Web interface for management and debugging
- WARNING BETA: (From their site: The CockroachDB executable for Windows is experimental and not suitable for production deployments. Windows 8 or higher is required.)

#### Configuration

You will now need to set the `DATABASE_URL` variable in two configuration files:

- `apps/web/.env`
- `packages/database/.env`. If you haven't already, create this file with `cp packages/database/.env.example packages/database/.env`.

If self-hosting using the `docker compose` method, then you can set your variable like so:

```bash
DATABASE_URL="postgresql://root@localhost:26257?sslmode=disable"
```

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

## Additional notes

### Workspaces

The Project uses [yarn workspaces](https://yarnpkg.com/cli/workspace), which are defined in `/package.json`.

Each submodule (database/webfrontend/webbackend/desktop app) defines its own `package.json` which is then used by yarn to run commands on it.

For example, running the webfrontend can be done with: `yarn workspace web start`.

## Picking work

> Please follow the GitHub Projects, Milestones, and Issues:

- [Projects](https://github.com/orgs/waldo-vision/projects/6) detail current side projects or larger systems.
- [Milestones](https://github.com/waldo-vision/waldo/milestones) detail current priority goals.
- [Issues](https://github.com/waldo-vision/waldo/issues) detail individual features, bugs and tweaks to work on.

When picking work, please take note of an issue's labels. For example, we ask that you consider issues marked as `critical` or `bug` to be of the highest priority. Issues marked as `good first issue` are a good place to start, and anything tagged with `help wanted` is something we are actively looking for help with. Once you have chosen an issue, please assign yourself to it, and/or leave a comment on the issue to let us know you are working on it.

_Please keep in touch with our team via Discord, so we know who’s working on what._

## Before you commit

When contributing to this repository, please first discuss the change you wish to make via issue,
email, Discord, or any other method with the owners of this repository before making a change.

We also ask that you test all your changes, never commit a secret, and follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for your commit messages.

Note we have a [code of conduct](/legal/code-of-conduct), please follow it in all your interactions with the project.

## Pull Request Process

1. Include your pull request with details of changes to the interface, this includes new environment
   variables, exposed ports, useful file locations and container parameters.
   - If you are adding a new feature, please include a screenshot of the feature in action.
   - Please also make sure you have updated the appropriate documentation to reflect any changes.
2. You may not merge any pull requests unless a code review has been completed by the owners of
   this repository.
3. Double check that IDE specific settings don't make it into the Git repository.
