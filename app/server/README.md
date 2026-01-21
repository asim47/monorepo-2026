# Server (Fastify + Prisma)

Backend API with Fastify, TypeScript, PostgreSQL (Prisma), JWT auth, Swagger, and optional AWS S3 and Brevo email.

## Stack

- **Runtime**: Node.js 20+
- **Framework**: Fastify 5
- **DB**: PostgreSQL, Prisma, `@prisma/adapter-pg`, `pg`
- **Auth**: JWT (`jsonwebtoken`), `bcrypt`
- **Validation**: Zod
- **Docs**: `@fastify/swagger`, `@fastify/swagger-ui`
- **Plugins**: CORS, Helmet, rate-limit, multipart
- **Optional**: AWS S3, Brevo email

## Structure

```
├── db/               # Prisma client, connection
├── helpers/          # Auth (bcrypt, jwt), AWS S3, email
├── middleware/       # isAuthenticated
├── plugins/          # cors, security, swagger, rateLimit, multipart
├── routes/           # health, auth, user (+ controllers)
├── schemas/          # Zod (auth, user)
├── scripts/          # e.g. test-db-connection
├── types/            # routeContext
├── utils/            # env, errorHandler, HttpError, logger, swaggerSchemas
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── docker-compose.yml   # PostgreSQL
├── prisma.config.js
└── index.ts
```

## Running the app

### From monorepo root

```bash
npm run dev:server
# DB: npm run db:up | db:down | db:migrate | db:generate | db:studio | db:test
```

### From this directory

```bash
cd app/server
npm run dev
```

Server: **http://localhost:8000** (or `PORT` in `.env`)  
Swagger: **http://localhost:8000/api-docs**

## Environment variables

Create `.env` in `app/server`:

```env
# Server
PORT=8000
NODE_ENV=development

# Database (also used for docker-compose)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=nodejs_boilerplate
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
# DATABASE_URL is built from above if unset

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Optional: AWS S3
# AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME, AWS_CLOUDFRONT_DOMAIN

# Optional: Brevo
# BREVO_API_KEY, BREVO_API_URL, BREVO_FROM_EMAIL, BREVO_FROM_NAME
```

`utils/env.ts` defines defaults; `DATABASE_URL` is set from `POSTGRES_*` if missing.

## Database

PostgreSQL is run via Docker:

```bash
# From root
npm run db:up        # start Postgres
npm run db:down      # stop and remove
npm run db:stop      # stop, keep data
npm run db:logs      # logs
npm run db:reset     # remove data and restart
npm run db:test      # test connection
npm run db:generate  # Prisma generate
npm run db:migrate   # migrate dev
npm run db:studio    # Prisma Studio
```

Or from `app/server`: `npm run db:up`, `npm run db:migrate`, etc.

`docker-compose.yml` uses `POSTGRES_*` from `.env`; default container name: `nodejs-boilerplate-postgres`.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | `tsx watch index.ts` |
| `npm run build` | `tsc` → `dist/` |
| `npm run start` | `node dist/index.js` |
| `npm run type-check` | `tsc --noEmit` |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run format` | Prettier |
| `npm run db:*` | See Database section above |

## Adding routes

1. Add Zod schemas in `schemas/`.
2. Add controllers in `routes/<name>Routes/controllers/`.
3. Define routes in `routes/<name>Routes/<name>Routes.ts` and register in `routes/index.ts`.

Use `isAuthenticated` from `middleware/isAuthenticated.ts` for protected routes.

## Learn more

- [Fastify](https://fastify.io/)
- [Prisma](https://www.prisma.io/)
- [Zod](https://zod.dev/)
