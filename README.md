# TutorFlow

TutorFlow is a focused tutoring operations platform for 1:1 teaching. It helps tutors manage students, sessions, notes, and homework in one place, while layering AI-assisted planning, debriefing, and progress tracking to make each session more effective.

- Tutor + student workflow app
- Manage students, slots, notes, homework, and communication

## Tech Stack

- Language: `TypeScript`
- Agent: `AI SDK` + `Sarvam AI SDK` + `EVE` framework
- Frontend: `Next.js 15` + `React 19` + `Open-Next` + `TanStack`
- Backend: `Hono` + `oRPC`
- Database: `Drizzle ORM` + `PostgreSQL`
- Authentication: `Better Auth`
- UI/UX: `Tailwind CSS v4` + `Radix UI`
- Markdown Editor: `Lexical` rich-text editor
- Email: `React Email` templates
- Deployment: `Cloudflare Workers`

## Providers

- Auth: Better Auth
- Database: PostgreSQL (via Supabase)
- Email SMTP: Resend (via Nodemailer)
- Hosting/runtime: Cloudflare Workers

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

- teacher
  - default role on signup
  - manages students, slots, notes, homework
- student
  - accesses assigned sessions, notes, homework, profile
