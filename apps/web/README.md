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

| Variable                                  | Description                                                | Link                                                                                         |
| :---------------------------------------- | :--------------------------------------------------------- | :------------------------------------------------------------------------------------------- |
| DISCORD_CLIENT_ID                         | Discord OAuth client ID                                    | [docs](https://discordjs.guide/oauth2/#getting-an-oauth2-url)                                |
| DISCORD_CLIENT_SECRET                     | Discord OAuth client secret                                |                                                                                              |
| GOOGLE_CLIENT_ID                          | ...                                                        |                                                                                              |
| GOOGLE_CLIENT_SECRET                      | ...                                                        |                                                                                              |
| YOUTUBE_API_KEY                           | ...                                                        |                                                                                              |
| GITHUB_CLIENT_ID                          | GitHub OAuth client ID                                     | [docs](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app) |
| GITHUB_CLIENT_SECRET                      | GitHub OAuth client secret                                 |                                                                                              |
| BTLNET_CLIENT_ID                          | ...                                                        |                                                                                              |
| BTLNET_CLIENT_SECRET                      | ...                                                        |                                                                                              |
| TWITCH_CLIENT_ID                          | ...                                                        |                                                                                              |
| TWITCH_CLIENT_SECRET                      | ...                                                        |                                                                                              |
| FB_CLIENT_ID                              | ...                                                        |                                                                                              |
| FB_CLIENT_SECRET                          | ...                                                        |                                                                                              |
| CLOUDFLARE_TURNSTILE_SECRET               | ...                                                        |                                                                                              |
| NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY | ...                                                        |                                                                                              |
| DATABASE_URL                              | Postgres connection string used to connect to CockroachDB. |                                                                                              |
| NEXTAUTH_URL                              | ...                                                        |                                                                                              |
| NEXTAUTH_SECRET                           | ...                                                        |                                                                                              |

### Starting the server

If you have not already, then follow the [set-up documentation](https://docs.waldo.vision/en/getting-started).

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
