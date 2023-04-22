---
title: Working in the Monorepo
description: Working in the Waldo Vision monorepo
layout: ../../layouts/MainLayout.astro
---

Just some advice for working in the [Waldo Vision monorepo](https://github.com/waldo-vision/waldo).

## Project Structure

Inside the `apps` directory are all the Waldo Vision "apps". This includes this website (the docs), the main Waldo Vision website, and the desktop app.

Inside the `packages` directory is code that is reused between many of the different apps. You can consider these packages to be shared utilities if it helps you conceptualize it.

## Breaking Change Guide

If your pull request contains a breaking change you must specify what the breaking change is and add it to the changelog for the current version.

## Useful Commands

### Turbo

With [Turborepo](https://turbo.build/repo/docs/reference/command-line-reference), the command `turbo run` allows you to run the same command in every workspace.

Say you wanted to build everything, you just need to run `turbo run build`, and every workspace will begin to build in the correct order.
You could also for example lint everything with `turbo run lint`.

You should note that unless you have turbo installed globally, you will need to do `yarn turbo` instead of just `turbo`.

### Yarn Workspaces

With [yarn workspaces](https://yarnpkg.com/cli/workspace), you are able to run commands in a specific workspaces.

For example, you can add react to the website with `yarn workspace web add react`, or build it alone with `yarn workspace web build`.

## Labeling PRs Effectively

> This section applies to maintainers only

Due to our use of [release-drafter](https://github.com/release-drafter/release-drafter), the way we label PRs is important in automatically building out our releases. In addition to the labels that the auto labeler adds, we have a few more important labels you have to add yourself to PRs. For example, if you are adding a new feature, you should add the `feature` label to the PR. If you are fixing a bug, you should add the `bug` label to the PR, and so on. Furthermore, you **_can_** instruct release-drafter that it needs to increment the major, minor, or patch version by adding the `major`, `minor`, or `patch` label to the PR in addition to the other labels. To better understand what exact labels you should use for a given category of PR, you can look at the [release-drafter config](https://github.com/waldo-vision/waldo/blob/master/.github/release-drafter.yml).
