# Kanban backend in NestJS

## Setup

1. Install dependencies.

```bash
yarn
```

2. Copy `.env.example` to `.env.development` and fill out the variables.

## Running the app

1. Run docker containers.

```bash
make up
```

2. Start the server.

```bash
# development
yarn run start

# watch mode
yarn run start:dev

# production mode
yarn run start:prod
```

## Deploying the app

Copy `release.env.example` to `release.env`. Then, run:

```bash
bash release.sh
```

## Debugging

The launch configuration for VSCode is available. Press F5 or go to `Run -> Start debugging` in the menu.

## Running tests

```bash
# setup
make setup-tests

# e2e tests
yarn run test:e2e

# coverage
yarn run test:cov
```

## Migrations

To generate a new migration:

```bash
# use npm, not yarn!
npm run typeorm:generate-migration --name=<name>
```

To run migrations:

```bash
npm run typeorm:run-migrations
```
