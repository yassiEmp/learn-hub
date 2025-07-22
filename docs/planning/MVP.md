NB: the mvp part musb be designed so that they will integrate well with the upcomming features

# ✅ **MVP Goals**

<!-- All MVP tasks and checklists have been moved to [TASKS.md](../planning/TASKS.md) for centralized tracking. Please refer there for up-to-date progress and task management. -->

The MVP should:

1. Accept user educational content (PDF, text, image)
2. Generate structured **lessons** from content
3. Generate **questions** from lessons
4. Allow users to **take an exam**
5. Auto-grade the exam and provide **feedback**
6. Show basic **progress dashboard**
7. Allow **basic course sharing**

---

# ⚙️ **MVP FEATURE LIST**

---

## 🧩 CORE FEATURES

### 1. **User Auth**

- Email + Password login
- Google OAuth (optional)

### 2. **Upload Module**

- Upload PDF or YouTube link
- Store original + metadata

### 3. **Content Extraction**

- PDF → text (via `pdfplumber`)
- YouTube → audio → text (via `yt_dlp` + `Whisper`)

### 4. **Lesson Generation**

- Split text into lessons via:
    - Headings
    - Paragraphs
- Store as `Lesson` objects with title + content

### 5. **Course Management**

- Each upload or course creation uses `POST /course` endpoint
    - `creationStyle: 'markdown stylized'`: Receives markdown, forwards to lesson endpoint, which stylizes and creates the lesson, then links it to the course
    - `creationStyle: 'chunk'`: Splits raw text, calls lesson endpoint for each chunk (lesson endpoint creates simple lessons), then links them to the course
    - `creationStyle: 'AiGen'`: Calls AI/GenCourse, which returns a well-structured course and lessons to be added to the database
- Course = list of Lessons
- Basic UI to view courses + lessons

> Note: The course endpoint does not stylize or process lesson content itself; all lesson creation and stylization is handled by the lesson endpoint.

### 6. **Question Generation**

- MCQs (only in MVP)
- Per lesson
- Prompt LLM (OpenAI / Claude) to generate:
    - question
    - 4 options
    - correct answer index

### 7. **Exam Creation & UI**

- Generate a quiz from 1 lesson
- Random 5–10 questions
- Simple web-based quiz UI:
    - Radio buttons
    - Submit button

### 8. **Auto-Grading & Feedback**

- Compare answers to correct indexes
- Show:
    - Score
    - Correct/wrong breakdown
    - Suggested lesson to review

### 9. **Dashboard (Basic)**

- Show:
    - Courses
    - Lessons completed
    - Exams taken
    - Scores

---

## 📤 OPTIONAL MVP EXTRAS (nice-to-have)

### 🔄 Course Sharing (Public link)

- Share read-only course or lesson via URL

### 🪙 Gamification (very light)

- XP bar or badge for completing first quiz

---

# 🧱 **MVP STACK (Suggested)**

| Part | Tech |
| --- | --- |
| Frontend | Next.js + Tailwind |
| Backend | FastAPI |
| OCR/Transcribe | `Whisper`, `yt_dlp`, `pdfplumber` |
| LLM | OpenAI / Claude (via API) |
| DB | PostgreSQL + Prisma / SQLAlchemy |
| Embedding (if used) | OpenAI + `Qdrant` (optional in MVP) |
| Storage | Local (dev), S3 (prod) |
| Auth | Clerk / Firebase / NextAuth.js |
| Deployment | Vercel (Frontend) + Fly.io / Railway (API) |

---

# 🛣️ **PHASED MVP ROADMAP**

<!-- All MVP tasks and checklists have been moved to [TASKS.md](../planning/TASKS.md) for centralized tracking. -->

---

# 📌 MVP Deliverables

| Feature | Description |
| --- | --- |
| ✅ Upload → Course | Upload PDF → extract → lessons → course |
| ✅ MCQ Generation | 5+ MCQs per lesson via LLM |
| ✅ Quiz UI | User takes quiz, sees results |
| ✅ Feedback | Basic score, wrong questions, suggested review |
| ✅ Dashboard | Lessons/exams tracker |
| ✅ Sharing (opt.) | Link-based course sharing |