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

### Cloud Options

#### CockroachDB

If you don't wish to self host CockroachDB for development, we advise you use CockroachDB's free [serverless tier](https://www.cockroachlabs.com/get-started-cockroachdb/) during development.

### Self Hosting

If you feel comfortable self hosting, for our use case, you we require that you additionally install [Docker](https://www.docker.com/) and [Docker compose](https://docs.docker.com/compose/). Docker is used to help ensure that the services are setup consistantly setup accross all our contributors' machines. (If you want to use podman instead of docker, you can, but we will not provide assistance with it.)

To start the services locally, simply run `docker compose up -d`. Or shut them off with `docker compose down`. (Run these in the repo after you have cloned it.)

## Setting Up Code

1. Clone the git repo `https://github.com/waldo-vision/waldo` to your machine and cd inside
1. Run `yarn install` to install all the necessary dependencies
1. To setup our ORM, run `yarn turbo db:generate`
1. Now, you need to choose whether you want to login with Discord, or Github
   - If you choose Github, follow [this guide](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app). Be sure to set the `Callback URL` to `http://localhost:3000/api/auth/callback/github`
   - If you choose Discord, follow [this guide](https://discordjs.guide/oauth2/#getting-an-oauth2-url) until you have added the `Redirect URL`. Be sure to set this to `http://localhost:3000/api/auth/callback/discord`
1. Copy `apps/web/.env.example` and rename said copy to `apps/web/.env`

   - Take the `client id` and `client secret` from the above to fill in the fields in the .env file like so:

   ```.env
    DISCORD_CLIENT_ID="57324592435671234019234"
    DISCORD_CLIENT_SECRET="342759ASDa82dsaf345-ADHFUFA"

    GITHUB_CLIENT_ID="7482521243341245243"
    GITHUB_CLIENT_SECRET="FDGNJO3490TNGFMGDSK"
   ```

1. To connect to the database, in the `.env` file set the `DATABASE_URL` like below:

   ```.env
    DATABASE_URL="postgresql://root@localhost:26257?sslmode=disable"
   ```

   (This is if your self hosting, if your using CockroachDB cloud, copy the connection URL from the dashboard.)

1. Run `yarn turbo run db:push` to setup the database for the website

1. You may also want to additionally set the `Cloudflare Turnstile` keys for submissions to work, or the `Youtube API Key` for the review site to work properly.

   - Currently there is no guide for these items, but there isn't much to setting them up. The only item of note is that the YT API Key needs to be `version 3` of the api.
   - If you do not wish to setup a cloudflare site to be able to generate turnstile keys, you can use the demo site and secret keys which you can find here: https://developers.cloudflare.com/turnstile/frequently-asked-questions/#are-there-sitekeys-and-secret-keys-that-can-be-used-for-testing.

1. The finale `.env` file _might_ look a little something like this after everything is filled in:

   ```.env
    DISCORD_CLIENT_ID="57324592435671234019234"
    DISCORD_CLIENT_SECRET="342759ASDa82dsaf345-ADHFUFA"

    GITHUB_CLIENT_ID="7482521243341245243"
    GITHUB_CLIENT_SECRET="FDGNJO3490TNGFMGDSK"

    DATABASE_URL="postgresql://root@localhost:26257?sslmode=disable"

    # plus some other stuff if you set it
   ```

1. There is additional `.env` file in `packages/database`. The database url should be the same as above.

   ```.env
    DATABASE_URL="postgresql://root@localhost:26257?sslmode=disable"
   ```

## Picking work

> Please follow the GitHub Projects, Milestones, and Issues

- [Projects](https://github.com/orgs/waldo-vision/projects/6) detail current side projects or larger systems
- [Milestones](https://github.com/waldo-vision/waldo/milestones) detail current priority goals
- [Issues](https://github.com/waldo-vision/waldo/issues) detail individual features, bugs, tweaks to work on

When picking work, please take note of an issue's labels. For example, we ask that you consider issues marked as `critical` or `bug` to be of the highest priorities. Issues marked as `good first issue` are a good place to start, and anything tagged with `help wanted` is something we are actively looking for help with. Once you have chosen an issue, please assign yourself to it, and/or leave a comment on the issue to let us know you are working on it.

_Please keep in touch with our team via Discord, so we know who’s working on what._

## Before you commit

When contributing to this repository, please first discuss the change you wish to make via issue,
email, Discord, or any other method with the owners of this repository before making a change.

We also ask that you test all your changes, never commit a secret, and follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for your commit messages.

Please note we have a [code of conduct](/legal/code-of-conduct), please follow it in all your interactions with the project.

## Pull Request Process

1. Include your pull request with details of changes to the interface, this includes new environment
   variables, exposed ports, useful file locations and container parameters.
   - If you are adding a new feature, please include a screenshot of the feature in action.
   - Please also make sure you have updated the appropriate documentation to reflect any changes.
2. You may not merge any pull requests unless a code review has been completed by the owners of
   this repository.
3. Double check that IDE specific settings don't make it into the Git
