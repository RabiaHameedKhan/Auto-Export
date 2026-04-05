# Auto Export — Vehicle storefront

Next.js 14 (App Router), PostgreSQL (Drizzle), NextAuth (admin), Tailwind CSS.

## Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 14+ (local install or Docker)

## 1. Install dependencies

```bash
npm install
```

On Windows, if `npm` fails with a PowerShell execution policy error, use:

```bash
npm.cmd install
```

## 2. Environment variables

Copy the example file and edit it:

```bash
copy .env.example .env.local
```

Set at least:

| Variable | Purpose |
|----------|--------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret (e.g. `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | App URL, e.g. `http://localhost:3000` |

Example `DATABASE_URL` for the included Docker setup:

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/autoexport
```

## 3. Run PostgreSQL

### Option A — Docker (recommended)

Install [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/), start it, then from the project root:

```bash
docker compose up -d
```

This starts Postgres 16 with user `postgres`, password `postgres`, database `autoexport`, port `5432`.

Stop (keep data):

```bash
docker compose down
```

Stop and remove the data volume:

```bash
docker compose down -v
```

### Option B — PostgreSQL on Windows

Install from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/), create a database (e.g. `autoexport`), then set `DATABASE_URL` to match your user, password, host, and database name.

## 4. Database schema and seed data

Create tables (Drizzle push):

```bash
npm run db:push
```

Load dummy inventory, catalog, admin user, and site settings:

```bash
npm run db:seed
```

- Default admin: **`admin@example.com`** / **`changeme`** — change this in production.

Optional: open Drizzle Studio to inspect the database:

```bash
npm run db:studio
```

## 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

On Windows, if needed:

```bash
npm.cmd run dev
```

## 6. Useful URLs

| URL | Description |
|-----|----------------|
| `/` | Public homepage |
| `/search` | Used vehicle listings |
| `/login` | Admin sign-in |
| `/admin` | Admin dashboard (requires login) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run db:push` | Sync Drizzle schema to the database |
| `npm run db:generate` | Generate SQL migrations (Drizzle Kit) |
| `npm run db:seed` | Seed dummy data (`scripts/seed-dummy.mjs`) |
| `npm run db:studio` | Drizzle Studio |

## Project docs

See `auto-export-website-prompt.md` for the full product specification.

## Troubleshooting

- **`DATABASE_URL is not set`** — Add it to `.env.local` and restart the dev server.
- **Connection refused** — PostgreSQL is not running, or host/port in `DATABASE_URL` is wrong.
- **`npm` script disabled** in PowerShell — Run `npm.cmd` instead, or set execution policy for your user: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
