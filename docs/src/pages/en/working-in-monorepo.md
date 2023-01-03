---
title: Working in the Monorepo
description: Working in the Waldo monorepo
layout: ../../layouts/MainLayout.astro
---

Just some advice for working in the [Waldo monorepo](https://github.com/waldo-vision/waldo).

## Project Structure

Inside the `apps` directory are all the Waldo "apps". This includes this website (the docs), the main Waldo website, and the desktop app.

Inside the `packages` directory is code that is reused between many of the different apps. You can consider these packages to be shared utilities if it helps you conceptualize it.

## Useful Commands

### Turbo

With [Turborepo](https://turbo.build/repo/docs/reference/command-line-reference), the command `turbo run` allows you to run the same command in every workspace.

Say you wanted to build everything, you just need to run `turbo run build`, and every workspace will begin to build in the correct order.
You could also for example lint everything with `turbo run lint`.

You should note that unless you have turbo installed globally, you will need to do `yarn turbo` instead of just `turbo`.

### Yarn Workspaces

With [yarn workspaces](https://yarnpkg.com/cli/workspace), you are able to run commands in a specific workspaces.

For example, you can add react to the website with `yarn workspace web add react`, or build it alone with `yarn workspace web build`.
