# 📚 LLM-Based Course Segmenter Planning

This document outlines the design of an AI-powered system to automatically transform raw course material into structured, learner-optimized lessons using LLMs.

---

## ✅ Goal

Turn raw, messy course text into well-structured lessons with:

* Logical sectioning
* Headings and summaries
* Explanations of complex parts
* Optional: examples, review questions, visuals

---

## ⚙️ System Architecture (High-Level)

1. **Input Preprocessing**

   * Raw course text (copy-pasted or uploaded)
   * Optional: metadata (language, subject, audience level)

2. **NLP-Based Pre-Split (Optional but recommended)**

   * Detect paragraphs or rough chunks
   * Light rules: max token/word count per block
   * Fast + reduces LLM calls → cheaper

3. **LLM-Powered Segment Analysis** (per chunk)

   * Input prompt to:

     * Add a heading
     * Summarize the section
     * Explain complex or technical parts
     * Suggest visuals or examples (optional)

4. **Postprocessing**

   * Merge results into structured JSON output
   * Optional export: Markdown, PDF, Word

5. **Display/UI (Future)**

   * Text area + button to generate lessons
   * Preview with tabs (Original / Lesson / JSON)

---

## 🧠 LLM Prompt Template (Few-shot, LangChain-compatible JSON output)

```txt
You are an expert course designer.
Transform the following raw course text into a structured lesson section.

Return a JSON object with the following fields:
{
  "title": "[string] title for this section",
  "summary": "[string] 2–3 sentence summary",
  "explanation": "[string] simplified explanation of technical or abstract parts",
  "examples": ["example 1", "example 2"] // optional
}

Text:
"""
[RAW TEXT]
"""
```

---

## 🧪 LLM Model Options

| Model               | Cost           | Speed     | Notes               |
| ------------------- | -------------- | --------- | ------------------- |
| Claude 3 Haiku      | ✅ Cheapest     | ✅ Fastest | Ideal for this task |
| GPT-4o Mini         | ✅ Cheap        | ✅ Fast    | Good reasoning      |
| Mistral 7B (Ollama) | ✅ Free (local) | ⚠️ Slower | Good offline option |

---

## 📦 Output Format (Structured JSON)

```json
{
  "title": "Understanding Microservices",
  "summary": "This section introduces microservices as a way to break down applications into smaller, manageable services.",
  "explanation": "Microservices are an architectural approach that allows teams to build and deploy services independently. This improves scalability but also adds complexity to communication and deployment.",
  "examples": [
    "Using separate services for authentication, payments, and notifications",
    "Deploying microservices on Kubernetes"
  ]
}
```

---

## 🛠️ Tools and Libraries

* Python + LangChain (for structured output parsing)
* spaCy or basic NLP for tokenizing pre-split
* JSON-to-Markdown renderer (optional)
* Optional: UI using Streamlit, Next.js, or Tauri

---

## 🧰 Next Steps

1. Implement pre-split logic ✅
2. Finalize LLM structured prompt ✅
3. Integrate LangChain for structured JSON output ✅
4. Build lesson JSON-to-Markdown renderer
5. Optional: add UI for uploading or pasting raw course text

---

## 🌞 Future Features

* Add review questions (QCM)
* Add diagrams from description (use DALL·E or Sora)
* Add citation or source generation
* Language switcher (English/French)
