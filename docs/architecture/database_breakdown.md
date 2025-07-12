# 🧩 Database Breakdown for Scalable Learning App

This document outlines the recommended database technologies for each major part of the app. It explains why each technology was chosen, how to use it, and best practices for each.

---

## 1. 🔐 Authentication & User Management

### ✅ **Database**: PostgreSQL

**Why:**
- Strong support for relational data and constraints
- Widely used in production
- Plays well with Better Auth and other auth libraries
- Supports extensions like pgcrypto or pgvector if needed

**How to use:**
- Define `User` table with unique constraints on email
- Store profile-related data in a separate `UserProfile` table

**Tips:**
- Always use UUIDs for primary keys (`uuid_generate_v4()`)
- Separate auth (login/session) from profile (roles, XP, etc.)

---

## 2. 📄 File Upload & Document Metadata

### ✅ **Database**: PostgreSQL (metadata) + Cloudflare R2 (files)

**Why:**
- PostgreSQL handles metadata with relationships to users/lessons
- Cloudflare R2 is cheap, fast, and S3-compatible for file blobs

**How to use:**
- Store file reference (URL or key) in `Document` table
- Upload/download files via R2 SDK or S3-compatible APIs

**Tips:**
- Keep filenames deterministic (e.g., UUID or hash)
- Store file size/type for validation & UI

---

## 3. 📚 Lessons, Courses, Questions, Exams

### ✅ **Database**: PostgreSQL

**Why:**
- Best fit for structured, relational content with foreign keys
- ACID-compliant for high data consistency

**How to use:**
- Normalize: lessons ↔ courses ↔ exams via join tables
- Use enums for type fields (`exam_type`, `question_type`, etc.)

**Tips:**
- Use indexed `createdAt` and `ownerId` fields for faster dashboards
- Bundle inserts with transactions when creating new lessons/exams

---

## 4. 🤖 AI & Content Chunking

### ✅ **Database**: PostgreSQL + pgvector (or Qdrant later)

**Why:**
- `pgvector` allows storing and querying embeddings
- Keeps everything within the same relational DB initially
- Easy to migrate to Weaviate/Qdrant if scale increases

**How to use:**
- Add `embedding` column to `LessonChunk` table (`vector(1536)`)
- Use cosine similarity queries to match user questions to content

**Tips:**
- Normalize vectors before insertion
- Keep track of the model used in a `meta` table (e.g., OpenAI vs Claude)

---

## 5. 🔍 Full-Text & Semantic Search

### ✅ **Database**: Typesense (or Meilisearch)

**Why:**
- Extremely fast, typo-tolerant search engine
- Works well for document titles, course names, etc.
- Easily indexable via HTTP API or SDKs

**How to use:**
- Sync relevant fields from `Lesson`, `Course`, and `Question` tables
- Update index on creation/update of records

**Tips:**
- Use searchable synonyms for common student typos
- Store searchable JSON for flexible indexing (tags, content preview)

---

## 6. 📈 User Progress & Stats

### ✅ **Database**: PostgreSQL

**Why:**
- Most of the data (scores, stats, XP) is tied to relational entities
- Easy to compute aggregates and build dashboards

**How to use:**
- Use `UserStats` table and aggregate views for courses completed, XP, etc.
- Optionally, use materialized views for heavy queries

**Tips:**
- Create indexes on userId, courseId
- Consider using triggers or background workers to update aggregates

---

## 7. 🔁 Tokens, Magic Links, Sessions

### ✅ **Database**: Upstash Redis (or Redis with Fly.io/Railway)

**Why:**
- Low-latency, ideal for short-lived session/token storage
- Avoids bloating PostgreSQL with temporary data

**How to use:**
- Store token as key, userId as value, with TTL (time-to-live)
- Retrieve session/token on login or link click

**Tips:**
- Set short expirations (e.g., 15 mins)
- Use Redis namespaces like `magiclink:<uuid>`

---

## 8. 🌍 Public Sharing Tokens

### ✅ **Database**: PostgreSQL

**Why:**
- Tied to relational entities (courses, lessons)
- Needs expiry, token uniqueness, visibility controls

**How to use:**
- `SharedToken`: `{ id, entityType, entityId, token, visibility, createdAt, expiresAt }`

**Tips:**
- Generate tokens with high entropy (`crypto.randomUUID()`)
- Index `token` field for fast lookup

---

## 9. 🧪 Analytics (optional for scaling)

### ✅ **Database**: PostgreSQL (→ ClickHouse later if needed)

**Why:**
- Simple queries can be done via Postgres views
- ClickHouse only if you get into millions of events or logs

**How to use:**
- Track events like `lesson_viewed`, `exam_completed`
- Aggregate into daily summaries

**Tips:**
- Avoid writing to logs on every interaction — batch or debounce writes
- Store event context in JSONB for flexibility

---

# ✅ Conclusion

Start with PostgreSQL + R2 + Typesense for an 80/20 setup that scales well. Introduce vector DB and Redis only when needed. This setup gives you:

- ✅ Full relational power for your core data
- ✅ Search & AI integration for smart experiences
- ✅ Low-cost scale via open tools

Need help with actual schema files or infra provisioning? Ask anytime!

