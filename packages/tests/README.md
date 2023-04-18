# Integration tests

Integration tests are an integral part of application testing. The ensure that the app works end-to-end and behaves exactly as expected.

## Running tests

First make sure you have the waldo server running. Set your `packages/tests/.env` accordingly.

```bash
# Self-hosted example:
WALDO_URI=http://localhost:3000
```

Then, you should be ready to run the integration tests with `jest`.

```bash
yarn workspace tests jest
```
