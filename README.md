# TutorFlow

Platform for online tutors who teach students one-to-one

- Tutor + student workflow app
- Manage students, slots, notes, homework, and communication

## Tech Stack

- `Next.js 15` + `React 19` + `TypeScript`
- `Bun` runtime/scripts
- `Hono` server APIs
- `oRPC` + `TanStack Query`
- `Drizzle ORM` + `PostgreSQL`
- `Better Auth` (email/password auth)
- `Tailwind CSS v4` + `Radix UI` + `Base UI`
- `Lexical` rich-text editor
- `React Email` templates
- Deploy target: `Cloudflare Workers` (`wrangler`)

## Providers

- Auth: `Better Auth`
- Database: `PostgreSQL` (via `Supabase`)
- Email SMTP: `Resend` (via `Nodemailer`)
- Hosting/runtime: `Cloudflare Workers`

## Features

- Auth: sign up / sign in / session handling
- Teacher dashboard
  - invite students
  - create/manage slots
  - write notes
  - assign homework
  - manage student profiles
- Student dashboard
  - view calendar
  - view sessions
  - access notes
  - access homework
  - manage profile
- Transactional emails
  - student invite/account created
  - session updates
  - homework updates

## User Roles

- `teacher`
  - default role on signup
  - manages students, slots, notes, homework
- `student`
  - accesses assigned sessions, notes, homework, profile

## App Areas

- `app/(app)/teacher/*`
- `app/(app)/student/*`
- `app/login/*`

## Scripts (common)

- `bun run web:dev` — run web app
- `bun run server:dev` — run API server
- `bun run db:generate` — generate migrations
- `bun run db:migrate` — run migrations
- `bun run email:dev` — email preview server

## Environment Variables

- `AUTH_SECRET`
- `AUTH_URL` (optional)
- `CORS_ORIGIN` (optional)
- `DATABASE_URL`
- `DATABASE_URL_DIRECT` (for drizzle config)
- `NODEMAILER_PASS`
- `NEXT_PUBLIC_SERVER_URL` (optional)
