## TutorFlow — session platform

Build a multi-role web platform where tutors manage student profiles, run AI-assisted sessions, and track progress over time. Scoped for roughly 4–5 hours of focused work by an experienced developer.

Full-stack

Submit within 7 days of receiving this task. We need a live working URL and a GitHub repo. Include a tutor login and a student login in the README so we can test without setting anything up.

Multi-role auth

AI integration

Session lifecycle

EdTech

~4–5 hrs

## THE SCENARIO

TutorFlow is a lightweight platform for online tutors who teach students one-to-one. A tutor can manage their students, schedule sessions, use AI to prepare and debrief each session, and view student progress over time. Students log in to see their upcoming sessions, session notes, and AI-generated homework.

This is a real product shape, not a toy exercise. We expect you to make architectural decisions and own them — there is no single correct answer, and your reasoning matters as much as the code.

## SESSION L IFECYCLE — THE CORE BUSINESS LOGIC

Every session moves through these four states. Transitions must be controlled: a session cannot jump from Scheduled straight to AI reviewed, and completed sessions are read-only except for triggering the AI review.

## REQUIRED INTEGRATIONS

You must integrate at least these two external services:

AI model — OpenAI, Claude, or Gemini for the session logic

Persistent database — Postgres, Mongo, SQLite, or Supabase

Explain your database schema and your AI prompt strategy in the README. Prompt design is scored — a generic "generate a lesson plan" prompt will score low.


## FEATURE REQUIREMENTS

## Authentication — two roles

Tutor and Student accounts, JWT or session-based. A tutor sees their own students and sessions; a student sees only their own data. No open registration — tutors create student accounts.

## Session scheduling

A tutor creates a session by picking a student, a date and time, and a topic. No double-booking — the same tutor cannot hold two sessions at once. Basic validation required.

## Live session notes

While a session is in progress, the tutor can type notes that autosave. Notes persist — closing the tab and returning must not lose them. Use debounced autosave, not save-on-every- keypress.

## Student progress view

The tutor sees a timeline of all sessions for a student. An AI progress summary button calls the AI with all past debriefs and returns a short paragraph on the student's improvement areas.

## BONUS — NOT REQUIRED

Send an email notification to the student when a session is scheduled, using Resend, SendGrid, or any free-tier mailer.

## Student profile

Each student has a name, subject, current level, learning goals, and weak areas (free text). This profile is the AI's context — it must feed into session prep and progress analysis.

## AI pre-session plan

Before a session starts, the tutor can generate an AI plan: learning objectives, a four-point lesson outline, and three practice questions — all personalised using the student's profile and past session history.

## AI post-session debrief

After completing a session, the tutor triggers an AI debrief. The AI reads the tutor's notes and returns a session summary, two to three homework tasks for the student, and a suggested focus for the next session.

## Student portal

Students log in and see upcoming sessions, completed session notes (read-only), and their homework from the AI debrief. Keep it simple and minimal — students don't need full access.

## IMPORTANT

The reviewer must be able to test the app without running anything locally. All environment variables must live on the deployment, and test credentials must be in the README.

## WHAT TO SUBMIT

## Live URL

Deployed and reachable, with working test data.

## GitHub repository

Public, or shared with the reviewer.

## README

Schema description and AI prompt strategy.

## Test logins

One tutor account and one student account.

## ONE LAST THING

Add a five-sentence note on what you would build next if you had another day. This is where we learn how you think about product, not just code.
