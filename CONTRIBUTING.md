# Contributing to Pal

Thanks for considering a contribution! This guide covers everything you need
to get the project running locally and open a useful pull request.

## Project layout

```text
pal-project/
├── apps/
│   ├── web/    # Next.js frontend (App Router)
│   └── api/    # Express backend
│       └── src/
│           ├── models/       # Mongoose schemas (User, Match, Conversation, Opportunity)
│           ├── routes/       # Express routers, one file per resource
│           ├── services/     # GitHub OAuth + JWT helpers
│           ├── middlewares/  # requireAuth
│           └── config/       # env validation, DB connection
├── contracts/  # Soroban (Stellar) escrow contract, Rust
└── packages/
    ├── ui/     # Shared React components (@pal/ui)
    └── config/ # Shared TypeScript/ESLint config
```

## Prerequisites

* Node.js >= 18
* MongoDB running locally (or a connection string to Atlas)
* Rust + the `wasm32-unknown-unknown` target if you're touching `contracts/`

## Setup

```bash
npm install
cp .env.example apps/api/.env
cp .env.example apps/web/.env.local   # only the NEXT_PUBLIC_* values are read
```

Fill in `apps/api/.env`:

* `MONGODB_URI` — e.g. `mongodb://localhost:27017/pal-dev`
* `JWT_SECRET` — any long random string for local dev
* `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — from a
  [GitHub OAuth App](https://github.com/settings/developers) with callback
  URL `http://localhost:8080/api/v1/auth/github/callback`. You can leave
  these as placeholder values if you're not working on the auth flow —
  everything except sign-in will still work.

Start Mongo locally, then run everything:

```bash
npm run dev
```

The API listens on `:8080`, the web app on `:3000`.

## Before opening a PR

```bash
npm run lint
npm run build
npm run test
```

If you touched `contracts/`:

```bash
cargo test --manifest-path contracts/Cargo.toml
cargo build --manifest-path contracts/Cargo.toml --target wasm32-unknown-unknown --release
```

All of the above run in CI on every pull request — please make sure they
pass locally first.

## Making changes

1. Fork the repository and create a branch from `main`.
2. Pick an open issue (look for `good first issue`) or open one to propose
   your change before doing large work.
3. Keep pull requests focused — one logical change per PR.
4. Add or update tests for any behavior change. New API routes should have
   request-level tests (see `apps/api/src/routes/*.test.ts` for examples
   using `supertest` + `mongodb-memory-server`).
5. Write commit messages following
   [Conventional Commits](https://www.conventionalcommits.org/) (enforced by
   commitlint on commit) — e.g. `feat(api): add opportunity search filter`.
6. Open a Pull Request with a clear summary of what changed and why.

## Code style

Linting and formatting (ESLint + Prettier) are enforced via `npm run lint`
and a pre-commit hook. Run `npm run lint -- --fix` from the relevant
workspace to auto-fix most issues.

## Reporting bugs / requesting features

Use the issue templates in `.github/ISSUE_TEMPLATE`. Include steps to
reproduce, expected vs. actual behavior, and relevant logs.

## Questions

Join the [Telegram contributor chat](https://t.me/+zHoLOF7SrKU3Nzk0) — it's
the best place to discuss architecture or ask before starting on a bigger
change.
