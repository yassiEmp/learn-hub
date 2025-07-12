# 🧙 Database Breakdown for Scalable Learning App

This document outlines the recommended database technologies for each major part of the app. It explains why each technology was chosen, how to use it, and best practices for each. We've also selected the **most cost-effective and performant provider** for each.

---

## 1. 🔐 Authentication & User Management

### ✅ **Database**: PostgreSQL
### 👥 Best Provider: **Neon**

**Why Neon?**
- Serverless, autoscaling Postgres with usage-based pricing
- Great free tier (10GB, generous limits)
- Instant branching & staging support

**How to use:**
- Define `User` table with unique constraints on email
- Store profile-related data in a separate `UserProfile` table

**Tips:**
- Always use UUIDs for primary keys (`uuid_generate_v4()`)
- Separate auth (login/session) from profile (roles, XP, etc.)

---

## 2. 📄 File Upload & Document Metadata

### ✅ **Database**: PostgreSQL (metadata) + Cloudflare R2 (files)
### 👥 Best Providers: **Neon (Postgres)** + **Cloudflare R2 (Blob)**

**Why:**
- Neon + R2 is fast, scalable, and almost free for moderate file storage
- R2 has zero egress fees and S3 compatibility

**How to use:**
- Store file reference (URL or key) in `Document` table
- Upload/download files via R2 SDK or S3-compatible APIs

**Tips:**
- Keep filenames deterministic (e.g., UUID or hash)
- Store file size/type for validation & UI

---

## 3. 📚 Lessons, Courses, Questions, Exams

### ✅ **Database**: PostgreSQL
### 👥 Best Provider: **Neon**

**Why:**
- Structured, relational, fast JOINs
- Neon autoscaling fits variable traffic patterns

**How to use:**
- Normalize: lessons ↔ courses ↔ exams via join tables
- Use enums for type fields (`exam_type`, `question_type`, etc.)

**Tips:**
- Use indexed `createdAt` and `ownerId` fields for faster dashboards
- Bundle inserts with transactions when creating new lessons/exams

---

## 4. 🧠 AI & Content Chunking

### ✅ **Database**: PostgreSQL + pgvector (or Qdrant later)
### 👥 Best Providers: **Neon + pgvector extension** OR **Qdrant (self-hosted/cloud)**

**Why:**
- pgvector gives basic vector support inside Postgres
- Qdrant is more powerful for large vector workloads

**How to use:**
- Add `embedding` column to `LessonChunk` table (`vector(1536)`)
- Use cosine similarity queries to match user questions to content

**Tips:**
- Normalize vectors before insertion
- Keep track of the model used in a `meta` table (e.g., OpenAI vs Claude)

---

## 5. 🔍 Full-Text & Semantic Search

### ✅ **Database**: Typesense (or Meilisearch)
### 👥 Best Provider: **Typesense Cloud** or **Self-host on Fly.io**

**Why:**
- Typesense is highly optimized for search speed
- Simple to self-host or use managed cloud pricing ($10/month base)

**How to use:**
- Sync relevant fields from `Lesson`, `Course`, and `Question` tables
- Update index on creation/update of records

**Tips:**
- Use searchable synonyms for common student typos
- Store searchable JSON for flexible indexing (tags, content preview)

---

## 6. 📈 User Progress & Stats

### ✅ **Database**: PostgreSQL
### 👥 Best Provider: **Neon**

**Why:**
- High query performance with aggregation
- Can scale easily as users grow

**How to use:**
- Use `UserStats` table and aggregate views for courses completed, XP, etc.
- Optionally, use materialized views for heavy queries

**Tips:**
- Create indexes on userId, courseId
- Consider using triggers or background workers to update aggregates

---

## 7. ↺ Tokens, Magic Links, Sessions

### ✅ **Database**: Upstash Redis (or Redis Cloud)
### 👥 Best Provider: **Upstash** (serverless Redis)

**Why:**
- Pricing per request + generous free tier
- Simple HTTP API (no Redis client needed)

**How to use:**
- Store token as key, userId as value, with TTL (time-to-live)
- Retrieve session/token on login or link click

**Tips:**
- Set short expirations (e.g., 15 mins)
- Use Redis namespaces like `magiclink:<uuid>`

---

## 8. 🌍 Public Sharing Tokens

### ✅ **Database**: PostgreSQL
### 👥 Best Provider: **Neon**

**Why:**
- Tied to relational entities (courses, lessons)
- Neon handles small transactional tables well

**How to use:**
- `SharedToken`: `{ id, entityType, entityId, token, visibility, createdAt, expiresAt }`

**Tips:**
- Generate tokens with high entropy (`crypto.randomUUID()`)
- Index `token` field for fast lookup

---

## 9. 🧪 Analytics (optional for scaling)

### ✅ **Database**: PostgreSQL (→ ClickHouse later if needed)
### 👥 Best Providers: **Neon (initial)** → **ClickHouse Cloud (if large-scale)**

**Why:**
- Neon for basic stats
- ClickHouse for event-heavy dashboards at scale (columnar DB)

**How to use:**
- Track events like `lesson_viewed`, `exam_completed`
- Aggregate into daily summaries

**Tips:**
- Avoid writing to logs on every interaction — batch or debounce writes
- Store event context in JSONB for flexibility

---

# ✅ Conclusion

Start with **Neon (PostgreSQL)** for structure, **Cloudflare R2** for files, **Typesense** for search, and **Upstash** for sessions. This setup provides:

- ✅ Cost-effective, usage-based scaling
- ✅ Open-source/portable stack
- ✅ Minimal vendor lock-in

Introduce ClickHouse, Qdrant, or Meilisearch as scale demands.

