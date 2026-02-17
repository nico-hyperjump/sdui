# Hyperjump Web Framework (WIP)

This is the monorepo for the Hyperjump Web Framework.

## Prerequisites

- **Node.js** >= 20
- **pnpm** 10.4.1 (`corepack enable && corepack prepare pnpm@10.4.1 --activate`)
- **Docker** (for the existing web app's PostgreSQL database only)

## Install

```bash
pnpm install
```

> If you see a warning about `better-sqlite3` build scripts being ignored, run
> `pnpm approve-builds` and select `better-sqlite3`, then `pnpm install` again.

---

## SDUI Platform (Server-Driven UI)

The SDUI platform is a multi-brand mobile app platform PoC consisting of several packages and apps:

| Project                     | Description                                                    |
| --------------------------- | -------------------------------------------------------------- |
| `packages/sdui-schema`      | Shared TypeScript types and Zod validation schemas             |
| `packages/sdui-database`    | Prisma + SQLite data layer (screens, flags, themes, A/B tests) |
| `packages/sdui-service`     | Public API for the mobile SDK (API key auth)                   |
| `packages/sdui-cms-service` | Admin API for the CMS (JWT auth)                               |
| `packages/sdui-sdk`         | React Native UI SDK (client, renderer, components)             |
| `packages/cms`              | React + Vite admin panel                                       |
| `apps/server`               | Hono host server mounting both APIs                            |
| `apps/mobile`               | Expo React Native app (3 brand variants + demo brand)          |

### Quick start

One command sets up the database (generate, migrate, seed) and starts both the API server and CMS dev server:

```bash
pnpm dev:sdui
```

This runs via Turbo and automatically:

1. Generates the Prisma client
2. Applies database migrations
3. Seeds demo data (3 brands, 6 screens, feature flags, A/B test, API keys, admin user)
4. Starts the **SDUI server** on **http://localhost:3001**
5. Starts the **CMS admin panel** on **http://localhost:5173/admin**

| Endpoint      | Description                                         |
| ------------- | --------------------------------------------------- |
| `GET /health` | Health check                                        |
| `/api/v1/*`   | Public SDUI API (requires `X-API-Key` header)       |
| `/api/cms/*`  | Admin CMS API (requires JWT `Authorization` header) |

CMS login credentials: `admin@telco-poc.com` / `admin123`

> Set `VITE_CMS_API_URL=http://localhost:3001/api/cms` in `packages/cms/.env` if the
> CMS API is on a different origin than the default.

**Test the API:**

```bash
# Health check
curl http://localhost:3001/health

# Fetch Brand A home screen (use demo API key)
curl "http://localhost:3001/api/v1/screens/home?brand=brand_a" \
  -H "X-API-Key: sk_brand_a_demo_key"

# Fetch Brand A config (theme + feature flags)
curl "http://localhost:3001/api/v1/config/brand_a" \
  -H "X-API-Key: sk_brand_a_demo_key"

# Admin login (returns JWT)
curl -X POST http://localhost:3001/api/cms/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@telco-poc.com","password":"admin123"}'
```

### Running individual services

If you prefer to start things separately:

```bash
# Database setup only
pnpm --filter @workspace/sdui-database db:setup

# Server only
pnpm --filter @workspace/server dev

# CMS only
pnpm --filter @workspace/cms dev
```

### Start the mobile app in simulator

Requires the [Expo CLI](https://docs.expo.dev/get-started/installation/):

```bash
cd apps/mobile
# Start for Brand A (default)
pnpm dev:a

# Start for Brand B. Run in different terminal.
pnpm dev:b

# Start for Brand C. Run in different terminal.
pnpm dev:c

# Start for Demo Brand. Run in different terminal.
pnpm dev:demo
```

Expo will ask to use different ports for each brand. You can accept the default ports or use different ports by adding the `--port` flag.

Once the Expo server is running, use `shift + i` to select simulator device. Use different devices for each brand if you want to see all three brands in the same time.

Brand variants:

- `brand_a` -- Premium (navy/gold theme)
- `brand_b` -- Youth (purple/green theme)
- `brand_c` -- Value (orange/teal theme)

### Demo API keys

These keys are pre-seeded for development:

| Key                     | Brand scope  |
| ----------------------- | ------------ |
| `sk_brand_a_demo_key`   | Brand A only |
| `sk_brand_b_demo_key`   | Brand B only |
| `sk_brand_c_demo_key`   | Brand C only |
| `sk_all_brands_dev_key` | All brands   |

### Switching from SQLite to PostgreSQL

1. In `packages/sdui-database/prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`
2. In `packages/sdui-database/src/client.ts`, replace `@prisma/adapter-better-sqlite3` with `@prisma/adapter-pg`
3. Set `SDUI_DATABASE_URL` to a PostgreSQL connection string
4. Run `pnpm --filter @workspace/sdui-database db:migrate:dev` to generate new migrations

### Running tests

```bash
# All tests
pnpm test

# Schema package only
pnpm --filter @workspace/sdui-schema test

# SDK package only
pnpm --filter @workspace/sdui-sdk test
```

---

## Existing Web App

### Running the database

From the root of the monorepo, start the PostgreSQL database:

```bash
docker-compose up
```

### Running the demo web app

Prepare the `.env.local` files:

```bash
./dev-bootstrap.sh
```

Build the web app:

```bash
pnpm build --filter=web
```

Or run the development server:

```bash
pnpm dev --filter=web
```

---

## Running the docs

```bash
pnpm docs:dev
```

## Publishing the route-action-gen package

1. Go to the release page in GitHub and create a new release.
2. The release name should be in the format of `v<version>`.
3. The release description should be the changelog.
4. Publish the release.
5. The package will be published to npm automatically.
