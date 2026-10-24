# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: FlashMind

AI-powered learning platform that converts uploaded content (text, PDF, YouTube, URL, audio) into courses, lessons, and exams. Uses Gemini via LangChain for AI generation.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # ESLint (ts, tsx)
pnpm db:generate  # Generate a SQL migration from lib/db/schema.ts (drizzle-kit)
pnpm db:migrate   # Apply migrations in drizzle/ to DATABASE_URL
pnpm syncTask     # Sync tasks to Notion (requires .env.local)
```

No test runner is configured — `features/lesson-gen/test/lessonGen.test.ts` exists but has no test script wired up.

## Environment Variables

Copy `.env.example` to `.env.local`:
- `DATABASE_URL` — Neon Postgres (pooled connection string)
- `BETTER_AUTH_SECRET` + `BETTER_AUTH_URL` — Better Auth sessions; `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` + `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true` enable Google sign-in
- `GOOGLE_API_KEY` — Gemini API (all AI generation); `MODEL` picks the Gemini model
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob uploads

## Path Aliases

`@/*` maps to the project root (not `src/`). So `@/features/course/...` resolves to `features/course/...`.

## Architecture

The repo does **not** use `src/`. The shared layer is `components/`, `lib/`, `hooks/`, `utils/`, `contexts/`, `types/`, `stores/`.

```
features/          # Domain features (isolated)
  content-import/  # Text, URL, topic, PDF, YouTube, audio extraction
  course/          # Course creation + AI metadata extraction + ChunkAI
  exam/            # Exam creation and AI question generation
  lesson-gen/      # Standalone lesson generation service (see below)
components/        # Shared UI (shadcn primitives + app-specific)
lib/               # db/ (Drizzle schema + client), auth.ts (Better Auth server), auth-client.ts, rag/
utils/             # api-helpers.ts, auth/server.ts (verifyAuth), ai/, textProcessing/
contexts/          # AuthContext (wraps Better Auth useSession)
drizzle/           # Generated SQL migrations
types/             # Shared TypeScript types (course.ts, types.ts)
app/               # Next.js App Router — pages and API routes
  api/v1/          # REST endpoints: course, lessons, exam, exams, content-import, user
```

## Key Patterns

### Result type
All async AI and utility functions return `Result<T>`:
```ts
type Result<T> = { err: null; res: T } | { err: unknown; res: null }
```
Never throw across module boundaries — check `.err` before using `.res`.

### Database & Auth (Neon + Drizzle + Better Auth)
- Schema: `lib/db/schema.ts` (Better Auth tables + courses, lessons, exams, enrollments, document_chunks). Change it, then `pnpm db:generate && pnpm db:migrate`.
- Server DB access only: `import { db } from '@/lib/db'`. The browser never talks to the DB; it calls `/api/v1/*`.
- Server auth: `utils/auth/server.ts` → `verifyAuth(req)`; session is an httpOnly cookie, no Bearer tokens.
- Client auth: `lib/auth-client.ts` (`signIn`, `signUp`, `signOut`, `useSession`); `hooks/useAuth.ts` → `{ user, loading, isAuthenticated, signOut }`.
- All API routes call `verifyAuth` and scope queries by `ownerId = user.id`.

### API Response helpers (`utils/api-helpers.ts`)
Use `successResponse<T>()`, `errorResponse()`, `authErrorResponse()`, `serverErrorResponse()` — never return raw `NextResponse.json` in route handlers.

### Lesson Generation Service (`features/lesson-gen/`)
Standalone generator with three workflows selectable per request:
- `cheap` — fast, single-pass
- `premium` — concurrent batches (2 at a time) with structured Gemini output
- `hybrid` — middle ground

Entry point: `features/lesson-gen/service/index.ts` — exports `generateLessons(input)` as an `AsyncGenerator`. Course creation consumes it in-process inside `after()` and persists each lesson as it's yielded.

### Course Creation Flow
1. `POST /api/v1/course` — validates auth, calls `aiClient.generateCourseMetadata()`, inserts the course with `status = 'generating'`
2. `after()` runs lesson generation in the same function (`maxDuration = 300`), inserting lessons with `position`, then sets `status` to `ready`/`failed`
3. The course page polls `GET /api/v1/course/[id]` while generating; `POST /api/v1/course/[id]/retry` restarts failed generation

### ChunkAI (`features/course/utils/chunkAI/`)
Alternative processing path used when `style = "chunk"`. Preprocesses text → splits into sentences → semantic chunks → generates lessons per chunk. Entry: `EnhancedChunkAI.processText()`. Kept as a legacy/alternative to the lesson-gen service.

### Content Import (`features/content-import/`)
Handles extraction from all input types. Files uploaded to Vercel Blob; text extracted from PDFs via `pdf-parse`, YouTube via `youtube-transcript`, URLs via `cheerio`. Results typed as `ImportResult`.

## AI Models

All AI runs through **Gemini 2.0 Flash** via `@langchain/google-genai`. No OpenAI or Anthropic usage in production paths. LangChain is used for prompt templates and structured output parsing with Zod.
