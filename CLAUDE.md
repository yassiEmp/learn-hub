# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: FlashMind

AI-powered learning platform that converts uploaded content (text, PDF, YouTube, URL, audio) into courses, lessons, and exams. Uses Gemini via LangChain for AI generation.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # ESLint (ts, tsx)
pnpm syncTask     # Sync tasks to Notion (requires .env.local)
```

No test runner is configured — `features/lesson-gen/test/lessonGen.test.ts` exists but has no test script wired up.

## Environment Variables

Copy `.env.example` to `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` + `SUPABASE_SERVICE_ROLE_KEY` — Supabase auth & DB
- `GOOGLE_API_KEY` — Gemini API (all AI generation)
- `NEXT_PUBLIC_BASE_URL` — used for internal fetch calls between API routes (e.g. `/api/v1/course` fires-and-forgets to `/api/v1/lessons`)

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
lib/               # supabase.ts (browser client)
utils/             # api-helpers.ts, supabase/server.ts (server auth), ai/, textProcessing/
contexts/          # AuthContext (wraps Zustand authStore)
stores/            # authStore.ts (Zustand — auth state + Supabase session)
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

### Auth (Supabase)
- Browser: `lib/supabase.ts` → `supabase` client
- Server: `utils/supabase/server.ts` → `verifyAuth(req)`, `createServerClient(token)`, `getTokenFromRequest(req)`
- State: `stores/authStore.ts` (Zustand) — call `initialize()` once on app mount
- `hooks/useAuth.ts` re-exports from `contexts/AuthContext`
- All API routes validate the Bearer token via `verifyAuth` before any DB operations

### API Response helpers (`utils/api-helpers.ts`)
Use `successResponse<T>()`, `errorResponse()`, `authErrorResponse()`, `serverErrorResponse()` — never return raw `NextResponse.json` in route handlers.

### Lesson Generation Service (`features/lesson-gen/`)
Standalone generator with three workflows selectable per request:
- `cheap` — fast, single-pass
- `premium` — concurrent batches (2 at a time) with structured Gemini output
- `hybrid` — middle ground

Entry point: `features/lesson-gen/service/index.ts` — exports `generateLessons(input)` as an `AsyncGenerator`. The `/api/v1/lessons` route consumes this generator and streams lessons to the DB.

### Course Creation Flow
1. `POST /api/v1/course` — validates auth, calls `aiClient.generateCourseMetadata()` (Gemini via LangChain), inserts course row into Supabase
2. Fire-and-forget `fetch` to `POST /api/v1/lessons` with the raw content, workflow, and `lessonTitles`
3. `/api/v1/lessons` streams lesson generation via the lesson-gen service, persisting each lesson as it's yielded

### ChunkAI (`features/course/utils/chunkAI/`)
Alternative processing path used when `style = "chunk"`. Preprocesses text → splits into sentences → semantic chunks → generates lessons per chunk. Entry: `EnhancedChunkAI.processText()`. Kept as a legacy/alternative to the lesson-gen service.

### Content Import (`features/content-import/`)
Handles extraction from all input types. Files uploaded to Vercel Blob; text extracted from PDFs via `pdf-parse`, YouTube via `youtube-transcript`, URLs via `cheerio`. Results typed as `ImportResult`.

## AI Models

All AI runs through **Gemini 2.0 Flash** via `@langchain/google-genai`. No OpenAI or Anthropic usage in production paths. LangChain is used for prompt templates and structured output parsing with Zod.
