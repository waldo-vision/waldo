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
cp apps/app/.env.example apps/app/.env

# Open the file
vim apps/app/.env
```

#### Logto Identity Service

If you plan on running this app for development, you'll need to setup our authentication service, logto.

1. You have two choices to run the logto service, either run it locally in a docker container, or 2, use their cloud service.

2. Once you have created a logto cloud service account, or have started the logto service locally, we need to setup a few things on the logto dashboard. If running locally, navigate to https://localhost:3002

We'll need to create a few things on the logto dashboard to make sure the app can properly interact with the identity service. These include...

    - A NextJS application (for the submissions site)
    - A machine-to-machine application (for MAPI access via TRPC)
    - An API Resource (for TRPC)
    - A machine-to-machine Role with the "all" scope assigned to the TRPC app.

### Let's create our NextJS application

Once you are on the logto admin dashboard, head over to the applications tab to create our nextjs application.

Click create application, then select the nextjs framework.

![Alt text](/frontend_create.png)

Enter a name and a description. Then click create application, and finally click finish-and-done.

In this newly created application, you will find a bunch of things. Be sure to note down the App ID and the App Secret, as **we will need these later**.

![Alt text](/app_id_secret.png)

Next, set the post sign in/out uri's.
![Alt text](/post_sign_in_out.png)

Our setup for the Nextjs app is now done.

### Let's create our machine-to-machine application

The machine-to-machine application is required by logto to interact with their management api resource.

To create it, click create application, then for the framework, scoll all the way down and select machine-to-machine.

![Alt text](/m_t_m.png)

Then give it a name and a description and click create, and then finally finish-and-done.

In this newly created application, you will find a bunch of things. Be sure to note down the App ID and the App Secret, as **we will need these later**.

![Alt text](/m_t_m_app_id_secret.png)

We are now done with the machine-to-machine application

### Let's create our TRPC Api Resource

TRPC is our backend framework for waldo's services and we chose to use logto to protect it. In order for logto to protect an api, we need to create an api resource.

Go to the **api resources** tab and click **Create Api Resource**, select **`Continue without Tutorial`**.

![Alt text](/no_tutorial.png)

Provide a name to create the api resource. For the identifer, it does not need to be a URL that's accessable or running, it is just a identifier that is in URI format.

![Alt text](/api_resource.png)

### Create SuperAdmin Role

In order for our machine-to-machine app to work properly, we need to give it complete access to the logto management api.

To start, head to the roles tab and click **Create Role**.

Give the role a name and description, select show more options and click **machine-to-machine app role**. Then assign the Logto Management API - **all** permission scope to the role.

![Alt text](/role_create_1.png)

After you click create role, it will ask you to assign the newly created role to an application. Select the machine-to-machine application we created earlier.

![Alt text](/assign_app.png)

### Environment Variables (.env)

```.env

# Google Recaptcha
RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key


# database
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432?sslmode=disable"

# Logto

NEXT_PUBLIC_BASE_URL="http://localhost:3000"
COOKIESECRET='complex_password_at_least_32_characters_long'

# logto authorization / security
NEXT_PUBLIC_ID_ISSUER="https://localhost:3001/oidc"
NEXT_PUBLIC_RESOURCE_AUDIENCE="http://localhost:3000/api"
NEXT_PUBLIC_JWKS_ENDPOINT="https://localhost:3001/oidc/jwks"

# Local Dev Stuff
HTTPS_CERT_PATH=""
HTTPS_KEY_PATH=""
NODE_TLS_REJECT_UNAUTHORIZED=0

# disable authentication verification (ONLY USE FOR TESTING PURPOSES)
#DISABLE_VERIFY_AUTH=0

APP_ID="NextJS App ID"
APP_SECRET="NextJS App Secret"
ENDPOINT="https://localhost:3001"
BASE_URL="https://localhost:3000"
COOKIE_SECRET="complex_password_at_least_32_characters_long"

MAPI_APP_ID="tin984l12ndywwqp1badp"
MAPI_APP_SECRET="dLWTVgPrxTFXSGCL13dJO9Hk2T6Z5G3D"
MAPI_TOKEN_ENDPOINT="https://localhost:3001/oidc/token"
MAPI_RESOURCE_URI="https://default.logto.app/api"

```

### PostgreSQL

The primary database used by the app is PostgreSQL. You will need a working server to run this app locally.

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

Alternatively, you can use a cloud service as "your" database server.

#### Configuration

Given the .env file above, put your Nextjs application App ID & App Secret into the `APP_ID` AND `APP_SECRET` variables. Same with the machine-to-machine application App ID and App Secret into their respective env vars. As for all of the URI's, if you follow this guide to a T, you should not need to change those.

Google Recaptcha is still being implemented as of (1/17/24) so hang tight until we get that sorted.

#### RBAC Scopes and Permissions

Waldo uses RBAC (Role Based Access Control) to restict all actions and operations to roles and permission scopes. We use logto to manage all of these permissions and roles, therefore you **will need to create all of the scopes and permissions on the dashboard**

#### Roles

- Admin -- Waldo Project Leads and Team Leads, have access to all site functions.
- Moderator -- Help moderate site content as well as execute infractions if necessary. Also gain access to the API & developer portal.
- Verified -- Verified Waldo.Vision users, allowed to submit gameplay with cheat characteristics attached.
- User -- Default Waldo.Vision user.

### Migration

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

### Switching git branches

If you checkout git branches/commits you may encounter different versions of the database & packages. This may mean, that your build won't compile, since the generated files are outdated.
To fix it, run

```bash
yarn branch
```

which is just a fancy shortcut for (if you need to fix command failure):

```bash
yarn install #install dependencies
yarn turbo db:generate #generate new db model
yarn turbo run db:push #deploy the current db model to dev database
```

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

### Formatting

We use [Prettier](https://prettier.io) to ensure consistent formatting across the codebase.

Ensure your changes have been properly formatted by running `yarn run format`.

### Integration Tests

We utilize integration tests to verify that our APIs are working as intended and any changes made do not break existing endpoints.

Please ensure all tests are passed before opening a PR.

```bash
# Start the server in `dev` mode.
yarn workspace web dev

# OR build an optimized deployment
yarn workspace web build
node apps/web/.next/standalone/apps/web/server.js

# In a seperate tab
yarn turbo run tests:int
```

## Pull Request Process

1. Include your pull request with details of changes to the interface, this includes new environment
   variables, exposed ports, useful file locations and container parameters.
   - If you are adding a new feature, please include a screenshot of the feature in action.
   - Please also make sure you have updated the appropriate documentation to reflect any changes.
2. You may not merge any pull requests unless a code review has been completed by the owners of
   this repository.
3. Double check that IDE specific settings don't make it into the Git repository.
