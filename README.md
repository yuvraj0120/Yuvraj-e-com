# Yuvraj-e-com

E-commerce web app built with **Next.js (App Router)**, **Prisma**, and **NextAuth**.

## Tech stack

- **Framework**: Next.js
- **UI**: React, Tailwind CSS, shadcn-style component setup
- **Auth**: NextAuth + Prisma Adapter
- **Database**: PostgreSQL (via Prisma)

## Requirements

- Node.js (recommended: latest LTS)
- PostgreSQL database (local or hosted)

## Setup (local development)

Install dependencies:

```bash
npm install
```

Create your env file:

```bash
copy .env.example .env
```

Update `.env` values (examples are in `.env.example`):

- `DATABASE_URL`: your Postgres connection string
- `AUTH_SECRET`: a long random secret
- `NEXTAUTH_URL`: usually `http://localhost:3000` for local dev

Generate Prisma client:

```bash
npm run prisma:generate
```

Run DB migrations:

```bash
npm run prisma:migrate
```

Optional: seed database (if your seed script is configured):

```bash
npm run prisma:seed
```

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Common scripts

- `npm run dev`: start dev server
- `npm run build`: production build
- `npm run start`: run production server
- `npm run lint`: run ESLint
- `npm run prisma:studio`: open Prisma Studio

## Project structure (high level)

- `app/`: Next.js App Router routes and layouts
- `components/`: UI components
- `config/`: site configuration (branding, footer, navbar, socials, etc.)
- `lib/`, `hooks/`, `contexts/`, `types/`: app utilities and shared code
- `prisma/`: Prisma schema, migrations, seed
- `public/`: static assets

## Environment & secrets

- **Do not commit** your `.env`.
- Use `.env.example` as the template for required variables.

## Deployment notes

- Set `DATABASE_URL`, `AUTH_SECRET`, and `NEXTAUTH_URL` in your hosting provider.
- Run Prisma migrations during your deploy pipeline (or before starting the app).

## License

Private project (no license specified yet).
