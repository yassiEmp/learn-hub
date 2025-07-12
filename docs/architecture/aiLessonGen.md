# 📚 AI Lesson Generation & Course Architecture: Modern, Workflow-Driven Design

This document outlines a modern, workflow-driven architecture for AI-powered lesson generation and course creation. It details business-level workflows, interface design, pricing, legal constraints, and deployment strategies for a scalable, maintainable, and user-centric learning platform.

---

## ✅ Goal

Turn raw, messy course text into well-structured lessons with:

- Logical sectioning
- Headings and summaries
- Explanations of complex parts
- Optional: examples, review questions, visuals
- Support multiple business-level workflows (cheap, premium, hybrid) for cost, quality, and flexibility.
- Decouple lesson generation from course management for maximum reusability and scalability.


---

## ⚙️ System Architecture Overview

### Separation of Concerns
- **Lesson Generation Service**: Stateless, workflow-driven service (function or API) that takes raw content and returns structured lessons.
- **Course Service**: Orchestrates course creation, calls the lesson generation service, and manages course/lesson persistence.

### Business-Level Workflows
- **Cheap (Low-Cost/Offline/Local)**: Uses local or open-source models for segmentation and basic enrichment.
- **Premium (Cloud/LLM-Powered)**: Uses paid APIs (e.g., Gemini, Claude) for advanced segmentation and rich lesson rewriting.
- **Hybrid**: Combines local segmentation with cloud-based enrichment for balanced cost and quality.

- Use fast, cheap Hugging Face segmentation models (e.g., `IlyaGusev/segment-anything-text`, `czearing/article-segmenter`) for semantic chunking.
- Optionally, generate light explanations with small local LLMs (e.g., Mistral 7B).
- Output basic structured JSON.

## 🧭 Lesson Generation Service: Interface & Workflows

- Use Google Gemini or Anthropic Claude LLMs via API for advanced semantic segmentation and rich lesson rewriting.
- Generate titles, summaries, explanations, and examples.
- Return structured JSON optimized for learning.
- Export to Markdown, PDF, or UI preview.
### Main Interface
- **Input:**
  - `content` (string): Raw educational material.
  - `workflow` ("cheap" | "premium" | "hybrid"): Business-level workflow selection.
  - `metadata` (optional): Subject, language, audience, tags, etc.
  - `lessonCount` (optional): Desired number of lessons.
  - `enrich` (optional): Add summaries, objectives, etc.
- **Output:**
  - Array of lesson objects: `{ title, content, summary?, objectives?, exercises?, resources? }`
- **No DB interaction:** The service returns lessons; the consumer decides what to do with them.

### Example (TypeScript)
```ts
type LessonWorkflow = "cheap" | "premium" | "hybrid";

- Use HF models for initial segmentation.
- Use lightweight LLM calls to enrich segments.
- Save costs while maintaining quality.
type LessonInput = {
  content: string;
  workflow: LessonWorkflow;
  metadata?: {
    subject?: string;
    language?: string;
    audienceLevel?: string;
    tags?: string[];
  };
  lessonCount?: number;
  enrich?: boolean;
};

type Lesson = {
  title: string;
  content: string;
  summary?: string;
  objectives?: string[];
  exercises?: string[];
  resources?: string[];
};

## 🧠 LLM Prompt Template (LangChain-compatible JSON output)
function generateLessons(input: LessonInput): Promise<Lesson[]>;
```

### Example (API)
- **POST** `/api/lesson-gen`
- **Request Body:**
  ```json
  {
    "content": "...",
    "workflow": "premium",
    "metadata": { "subject": "Math", "language": "en" },
    "lessonCount": 5,
    "enrich": true
  }
  ```
- **Response:**
  ```json
  [
    {
      "title": "Introduction to Algebra",
      "content": "...",
      "summary": "...",
      "objectives": ["Understand variables", "Solve equations"],
      "exercises": ["Exercise 1", "Exercise 2"]
    }
    // ... more lessons
  ]
  ```

---

## 🧠 Workflow-Driven Lesson Generation

- **Workflow parameter** is the main selector for lesson generation strategy.
- Internally, each workflow maps to a technical implementation (local models, cloud APIs, or a mix).
- This abstraction allows you to change or optimize the underlying tech without breaking the interface.

### Benefits
- **Clarity:** Consumers choose based on business needs (cost, quality), not technical details.
- **Flexibility:** Underlying implementation can evolve.
- **Extensibility:** New workflows (e.g., "BYOK", "enterprise") can be added easily.

---

## 📦 Output Format (Structured JSON)

```json
{
  "title": "Understanding Microservices",
  "summary": "This section introduces microservices as a way to break down applications into smaller, manageable services.",
  "content": "...",
  "objectives": ["Understand microservices", "Deploy on Kubernetes"],
  "exercises": ["List microservice benefits", "Draw a microservice architecture"]
}
```

---

## 🛠️ Course Service: Orchestration & Persistence

| Model/Approach               | Cost         | Speed     | Quality       | Usage Notes                         |
|-----------------------------|--------------|-----------|---------------|-----------------------------------|
| Hugging Face segmenters      | Free (local) | Very fast | Moderate      | Great for segmentation only       |
| Local LLM (e.g., Mistral 7B) | Free (local) | Medium    | Good          | Good for lightweight explanation  |
| Google Gemini / Claude API   | Paid         | Fast      | Excellent     | Best for premium rewriting & summary |
- The course service is responsible for:
  - Accepting user input (raw content, metadata, workflow selection, etc.)
  - Calling the lesson generation service with the selected workflow
  - Storing the returned lessons and course metadata in the database
  - Managing course/lesson relationships, updates, and user progress
---

## 🧪 Model and Pricing Comparison Summary

| Workflow      | Cost         | Speed     | Quality       | Usage Notes                         |
|---------------|--------------|-----------|---------------|-------------------------------------|
| Cheap         | Free (local) | Very fast | Moderate      | Great for segmentation only         |
| Premium       | Paid         | Fast      | Excellent     | Best for premium rewriting & summary|
| Hybrid        | Mixed        | Fast      | Good          | Balanced cost and quality           |

---

## ⚖️ Legal & Compliance Notes on API Key Usage

| Scenario                                          | Legal? | Notes                                                 |
|---------------------------------------------------|--------|-------------------------------------------------------|
| Using your own paid Google API token to serve users | ✅     | Allowed; you bear costs                              |
| Asking users to provide their personal free-tier API keys | ❌     | Violates Google’s ToS                                |
| Automating user API key setup without consent      | ❌     | Violates ToS and privacy laws                        |
| Using OAuth for user-delegated API access           | ✅     | Legal but complex setup                              |
| Running local LLMs on user devices                   | ✅     | Fully compliant; no API needed                       |

---

## 🔐 OAuth + User Billing Model (Advanced)

- Users sign in with Google OAuth.
- They authorize your app to call Gemini API on their behalf.
- API usage is billed to their own Google Cloud account.
- Users benefit from $300 free GCP credit if new.
- Setup is complex: requires users to enable billing, create projects, enable APIs.
- Better for power users, less suitable for casual users.

---

## 🚦 Failover, Usage Limits & Heuristics Fallback for Free Users

- Implement rate limiting and usage tracking.
- Show friendly “quota exceeded” messages when limits are reached.
- Suggest upgrade to paid plan for uninterrupted service.
- Log and monitor usage to avoid hitting Google limits unexpectedly.
- When API quota is exceeded or calls fail:
  - Use heuristic-based methods (e.g., rule-based chunking, keyword or punctuation heuristics).
  - Use local lightweight models or fallback algorithms to provide a **basic segmentation and explanation**.
- This ensures the app **still delivers value to free users**, albeit with lower quality or less detail.
- Keeps free users engaged and reduces frustration during quota exhaustion.
- Helps smooth transition to paid plan by showing benefits of premium output.

---

## 🛠️ Tools and Libraries

- Python + LangChain (for structured output parsing)
- spaCy or basic NLP for tokenizing pre-split
- JSON-to-Markdown renderer (optional)
- Optional: UI using Streamlit, Next.js, or Tauri

---

## 🛠️ Deployment & Growth Plan

### Phase 1: MVP (Minimal Cost & Risk)
- Use your personal free-tier key sparingly.
- Strictly limit free user usage.
- Implement failover UI with heuristic/local fallback.
- Monitor usage daily.

### Phase 2: User Growth & Monetization
- Set up paid Google Cloud project and switch backend key.
- Add paid plans with higher quotas.
- Optionally, add OAuth flow for power users.
- Continue monitoring costs and usage.

### Phase 3: Scale & Optimize
- Optimize prompt design and chunk sizes to reduce tokens.
- Add UI onboarding wizards for OAuth billing setup.

---

## 🌞 Future Features

- Add review questions (QCM)
- Add diagrams from description (use DALL·E or Sora)
- Add citation or source generation
- Language switcher (English/French)

---

## 📋 Summary & Recommendations

- **Lesson generation is a standalone, workflow-driven service.**
- **Course service orchestrates lesson generation and persistence.**
- Expose business-level workflows (`cheap`, `premium`, `hybrid`) as the main interface for lesson generation.
- No DB interaction in lesson generation; consumer handles storage.
- Always display clear usage limits, failover info, and upgrade paths.
- Use heuristics and local fallback to maintain service quality during quota limits.
- Be transparent and legal to build trust and sustainability. 