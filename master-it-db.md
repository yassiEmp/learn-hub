# **flashmind Database Schema (Final Version)**


## 2. **Subjects**

```sql
CREATE TABLE Subjects(
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  user_id INT REFERENCES Users(id)
);
```

---

## 3. **Lessons**

```sql
CREATE TABLE Lessons(
  id SERIAL PRIMARY KEY,
  subject_id INT REFERENCES Subjects(id),
  title TEXT,
  content TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## 4. **Flashcards** (linked optionally to lessons)

```sql
CREATE TABLE Flashcards(
  id SERIAL PRIMARY KEY,
  subject_id INT REFERENCES Subjects(id),
  lesson_id INT REFERENCES Lessons(id), -- nullable
  question TEXT,
  answer TEXT,
  difficulty TEXT, -- easy, medium, hard
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## 5. **Exercises** (optional lesson link)

```sql
CREATE TABLE Exercises(
  id SERIAL PRIMARY KEY,
  subject_id INT REFERENCES Subjects(id),
  lesson_id INT REFERENCES Lessons(id), -- nullable
  type TEXT, -- fill_gap, mcq, true_false, etc.
  content JSONB,
  answer JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## 6. **Exams**

```sql
CREATE TABLE Exams(
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES Users(id),
  subject_id INT REFERENCES Subjects(id),
  title TEXT,
  settings JSONB, -- num questions, difficulty, time limit, etc.
  created_at TIMESTAMP
);
```

---

## 7. **Exam\_Questions**

```sql
CREATE TABLE Exam_Questions(
  id SERIAL PRIMARY KEY,
  exam_id INT REFERENCES Exams(id),
  question_id INT NOT NULL, -- links to Flashcards or Exercises
  order_num INT
);
```

---

## 8. **User\_Question\_Performance** (spaced repetition)

```sql
CREATE TABLE User_Question_Performance(
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES Users(id),
  question_id INT NOT NULL, -- flashcard or exercise
  lesson_id INT REFERENCES Lessons(id), -- nullable
  last_answered_at DATE,
  times_seen INT DEFAULT 0,
  times_correct INT DEFAULT 0,
  ease_factor FLOAT DEFAULT 2.5,
  next_review_date DATE,
  streak INT DEFAULT 0,
  difficulty_rating INT -- optional (1–5)
);
```

---

## 9. **Progress**

```sql
CREATE TABLE Progress(
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES Users(id),
  subject_id INT REFERENCES Subjects(id),
  flashcards_reviewed INT DEFAULT 0,
  exams_taken INT DEFAULT 0,
  success_rate FLOAT,
  last_activity TIMESTAMP
);
```

---

## 10. **Reminders**

```sql
CREATE TABLE Reminders(
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES Users(id),
  subject_id INT REFERENCES Subjects(id),
  title TEXT,
  reminder_date DATE,
  status TEXT -- pending, sent, completed
);
```

---

## **High-level Relationships**

```
Users ───< Subjects ───< Lessons ───< Flashcards / Exercises
   │                                │
   │                                └───< User_Question_Performance
   │
   ├───< Exams ───< Exam_Questions ───< Flashcards / Exercises
   │
   ├───< Progress
   └───< Reminders
```

---

✅ **Key Features Covered**

* Lessons → notes for each part of a course.
* Flashcards / Exercises optionally linked to lessons.
* Exams dynamically generated from flashcards/exercises.
* User\_Question\_Performance → tracks spaced repetition, streak, ease factor, next review date.
* Progress & reminders tracked per user/subject.
