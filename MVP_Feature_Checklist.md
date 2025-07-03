# ✅ MVP Feature Checklist

This document tracks the status of all MVP features for the Learn Hub project. Features are grouped as:
- **Done**: Fully implemented and working.
- **Scheduled for Modification**: Implemented but planned for improvement or refactor.
- **To Do**: Not yet implemented.

---

## ✅ Done
- [x] Email + Password login (basic auth via Supabase)
- [x] Upload PDF (UI and handler present)
- [x] Store original + metadata (document structure exists)
- [x] Course = list of Lessons (data structure and UI)
- [x] Basic UI to view courses + lessons (CourseBrowser, CourseDetail, CourseEditor)
- [x] Dashboard: Shows courses, lessons completed, exams taken, scores (Dashboard component)
- [x] Google OAuth (UI present, needs backend integration by adding relevant environements keys)

---

## 🛠️ Scheduled for Modification
- [ ] Lesson Generation: Split text into lessons (UI present, needs backend logic)
- [ ] Course Management: Each upload or creation uses POST /course endpoint with creationStyle (markdown stylized, chunk, AiGen)
    - Note: The course endpoint only splits or forwards text; the lesson endpoint is responsible for stylization and lesson creation.
- [ ] Question Generation: MCQs per lesson via LLM (UI present, needs backend integration)
- [ ] Exam UI: Quiz player (UI present, needs full integration with question/answer logic)
- [ ] Auto-grading & Feedback: Score, correct/wrong breakdown, suggested review , suggested lesson's (UI present, needs backend logic)
- [ ] Public sharing (UI/structure present, needs backend endpoint and token logic)
- [ ] Lesson Generation: Support for all creationStyle modes in lesson creation (UI present, needs backend logic)

---

## 🚧 To Do
- [ ] AI Text Generation: when user says 'generate a course for learning pizza cooking' (UI present, needs backend logic and ai automation logics)
- [ ] Content Extraction: PDF → text (needs backend integration with pdfplumber)
- [ ] Content Extraction: YouTube → audio → text (needs backend integration with yt_dlp + Whisper)
- [ ] Store and process YouTube links (UI button present, needs backend)
- [ ] Store and process other file types (e.g., images, videos)
- [ ] Full backend pipeline for content extraction and lesson chunking 
- [ ] LLM integration for question generation (OpenAI/Claude API)
- [ ] Exam result storage and analytics
- [ ] Share lesson via public link (endpoint and token logic)
- [ ] Gamification: XP bar or badge for completing first quiz
- [ ] (Optional) Course marketplace placeholder
- [ ] (Optional) practicing resources like find the resources that user can use to practice their learnings 
- [ ] Implement POST /course endpoint with creationStyle parameter
    - [ ] markdown stylized: Accept markdown, create stylized lesson, link to course
    - [ ] chunk: Split text, create multiple lessons, link to course
    - [ ] AiGen: Call AI/GenCourse, generate and link well-structured course and lessons

---

### How to use
- Move features between sections as their status changes.
- Add notes or links to issues/PRs as needed. 


### insight
- give the courses for free make them pay for the exams and the analitics
- use justin sung youtube channel has core functionalitty principle to implements for users free and paid ones 
- links for insigh about things to do 
<!-- https://youtu.be/oTQPxPFROck?si=DIzfpOKNOJm0G56x -->
<!-- https://youtu.be/6GTt10GDWII?si=isL8KrGFt3qW-BJ5 -->