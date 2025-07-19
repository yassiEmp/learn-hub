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

> Converts uploaded content into structured learning objects (lessons) using a standalone, workflow-driven lesson generation service. The course service sends all raw text and options (workflow, metadata, etc.) to the lesson generation service, which splits and enriches the content, returning full lesson objects. The course service then stores and links these lessons to the course.

### Entities:

- `Lesson`: `{ id, title, content, documentId, courseId?, createdAt }`
- `Chunk`: optional internal segmentation of content for better retrieval

### Processing Pipeline:

- Text extraction (PDF/YouTube)
- Course service sends raw text and options to lesson generation service
- Lesson generation service splits, enriches, and returns lesson objects
- Course service stores lessons and links them to the course

> See [aiLessonGen.md](../architecture/aiLessonGen.md) for workflow-driven interface details.

---

## 4. **Course System (Core Learning Container)**

> Allows grouping of lessons. The course service orchestrates lesson generation and persistence, but does not itself split or stylize lesson content.

### Entities:

- `Course`: `{ id, title, ownerId, description, tags[], visibility, createdAt }`
- `CourseLesson`: `{ id, courseId, lessonId, order }`

### Endpoints:

- `POST /course` (with `workflow: 'cheap' | 'premium' | 'hybrid'`)
    - The course service sends all raw content and workflow to the lesson generation service, receives full lesson objects, and stores/links them to the course.

### Future extensions:

- `CourseClass`, `CourseRating`, `MarketplaceListing`
- `visibility: 'private' | 'public' | 'shared'`

> Note: The course service is just an orchestrator. All lesson splitting, enrichment, and creation logic lives in the lesson generation service.

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

