# ✅ MVP BREAKDOWN (STRUCTURED FOR SCALABILITY)

---

## 1. **Authentication & Users**

> Core identity system with extensibility for roles, sharing, progress, and social features.
> 

### Entities:

- `User`: `{ id, name, email, passwordHash, profileImage, createdAt }`
- *(Extensible: role (student/teacher), linked accounts, XP, badges later)*

### Endpoints:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`

---

## 2. **File Upload & Document Handling**

> Entry point of the learning process. Keep metadata clean and ready for tracking and reference.
> 

### Entities:

- `Document`: `{ id, userId, title, type, source, status, uploadedAt }`

### Behavior:

- Upload via file or URL
- Store reference to file
- Emit background job for processing

### Future-proofing:

- Add `sharedWith`, `visibility`, `tags`, and `language` fields later

---

## 3. **Content Extraction & Lesson Creation**

> Converts uploaded content into structured learning objects (lessons). Designed to plug in other AI models later.
> 

### Entities:

- `Lesson`: `{ id, title, content, documentId, courseId?, createdAt }`
- `Chunk`: optional internal segmentation of content for better retrieval

### Processing Pipeline:

- Text extraction (PDF/YouTube)
- Chunking via heuristic/LLM
- Titles via AI (later: summarization/metadata tags)
- **Lesson creation via POST /course**: The course endpoint splits or forwards text, and the lesson endpoint is responsible for stylization and lesson creation.

---

## 4. **Course System (Core Learning Container)**

> Allows grouping of lessons. Can later be used for classes, markets, etc.
> 

### Entities:

- `Course`: `{ id, title, ownerId, description, tags[], visibility, createdAt }`
- `CourseLesson`: `{ id, courseId, lessonId, order }`

### Endpoints:

- `POST /course` (with `creationStyle: 'markdown stylized' | 'chunk' | 'AiGen'`)
    - **markdown stylized**: Receives markdown text, forwards it to the lesson endpoint, which stylizes and creates the lesson, then links it to the course.
    - **chunk**: Splits raw text into smaller chunks, calls the lesson endpoint for each chunk (lesson endpoint creates simple lessons), then links them to the course.
    - **AiGen**: Calls `AI/GenCourse` endpoint, which returns a well-structured course and lessons to be added to the database.

> Note: The course endpoint does not stylize or process lesson content itself; all lesson creation and stylization is handled by the lesson endpoint.

### Future extensions:

- `CourseClass`, `CourseRating`, `MarketplaceListing`
- `visibility: 'private' | 'public' | 'shared'`

---

## 5. **Question Generation & Storage**

> Uses AI to create reusable, structured quiz items.
> 

### Entities:

- `Question`: `{ id, lessonId, content, options[], answerIndex, type }`
- `QuestionMeta`: `{ difficulty, topic, generatedBy }`

### Types (MVP):

- MCQ only
    
    *(T/F, Short Answer later)*
    

---

## 6. **Exam Engine**

> Generates and manages the quiz-taking experience.
> 

### Entities:

- `Exam`: `{ id, courseId?, lessonId?, userId?, type, createdAt }`
- `ExamQuestion`: `{ id, examId, questionId }`
- `ExamResult`: `{ id, examId, userId, answers[], score, feedback }`

### Behavior:

- Auto-select questions from lesson
- Store answers and grade

---

## 7. **Feedback & Recommendations**

> Powered by exam results. Basic scoring in MVP, room to expand with AI later.
> 

### Structure:

- Based on missed questions → link back to lesson
- Suggest retry
- Embed structured feedback in `ExamResult`

---

## 8. **Dashboard (Personal Progress)**

> Tracks user learning activity
> 

### Entities:

- `UserStats`: `{ userId, coursesCompleted, lessonsReviewed, totalScore, xp }`
- Aggregated from:
    - Lessons viewed
    - Exams completed
    - Avg. score per course

---

## 9. **Public Sharing (Basic)**

> For viral utility and later marketplace integration.
> 

### Share Tokens:

- `SharedCourse`: `{ courseId, token, createdAt, visibility }`
- `SharedLesson`: `{ lessonId, token }`

### Endpoint:

- `GET /share/course/:token`
- View-only access

---

# 📦 DIRECTORY STRUCTURE (Backend Suggestion)

```
/src
  /auth
  /users
  /documents
  /lessons
  /courses
  /questions
  /exams
  /feedback
  /share
  /dashboard

```

---

# ✅ INTEGRATION STRATEGY FOR FUTURE FEATURES

| Future Feature | Already Supported by MVP Design? | Notes |
| --- | --- | --- |
| 🎓 Classes | ✅ Easily link `Course` to a `Class` entity with enrolled users |  |
| 🌐 Public Sharing | ✅ Token-based sharing already scaffolded |  |
| 🧠 AI Tutor | ✅ Lessons, Questions, Feedback provide foundation |  |
| 🎮 Gamification | ✅ Add XP per `ExamResult`, link to `UserStats` |  |
| 🏪 Marketplace | ✅ Courses have owner, metadata, and visibility field |  |
| 🔁 RAG Search | ⚠️ MVP doesn't use embedding yet, but `Lesson.content` is chunkable |  |

