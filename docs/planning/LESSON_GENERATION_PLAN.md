# 🧠 Lesson Generation Feature Development Plan

## 📋 Overview
This document outlines the development plan for the AI-powered lesson generation feature in Learn Hub. The goal is to transform raw educational content into structured, engaging lessons using workflow-driven AI pipelines, supporting multiple business-level workflows (cheap, premium, hybrid).

---

## 🎯 Goals & Current Pain Points

### **Current Problems:**
1. Manual lesson creation is slow and inconsistent
2. No automated enrichment (summaries, objectives, exercises)
3. Lack of workflow flexibility (cost/quality tradeoffs)
4. No robust fallback for API quota or failures
5. Limited user feedback and transparency

### **Goals:**
1. Automate lesson structuring and enrichment
2. Support multiple workflows (cheap, premium, hybrid)
3. Provide robust error handling and fallback
4. Expose clear API and UI for lesson generation
5. Enable future extensibility and integration

---

## 🏗️ Architecture & Interfaces

### **Lesson Generation Service**
- Stateless, workflow-driven
- No direct DB interaction
- Returns array of lesson objects

#### **TypeScript Interfaces**
```typescript
export type LessonWorkflow = 'cheap' | 'premium' | 'hybrid';

export interface LessonInput {
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
}

export interface Lesson {
  title: string;
  content: string;
  summary?: string;
  objectives?: string[];
  resources?: string[];
}

export async function generateLessons(input: LessonInput): Promise<Lesson[]>;
```

### **API Endpoint**
- `POST /api/lesson-gen`
- Input: `LessonInput`
- Output: `Lesson[]`

### **Workflows**
- **Cheap:** Local segmentation, basic enrichment (Hugging Face, small LLM)
- **Premium:** Cloud LLM APIs (Gemini, Claude) for advanced rewriting
- **Hybrid:** Local segmentation + cloud enrichment llm
- **Fallback for free:** Heuristic/local if fails/quota exceeded  
- **Fallback for premium:** use the hybrid if fails/quota exceeded  

---

## 📁 File Structure

**Proposed structure (inspired by aiLessonGen.md and your project conventions):**

```
features/lesson-gen/
├── service/
│   ├── index.ts                # Main entry for lesson generation logic
│   ├── workflows/
│   │   ├── cheap.ts            # Cheap workflow implementation
│   │   ├── premium.ts          # Premium workflow implementation
│   │   └── hybrid.ts           # Hybrid workflow implementation
│   ├── enrichment/
│   │   ├── summarizer.ts       # Summaries/objectives logic
│   │   ├── exerciseGen.ts      # Exercise generation logic
│   │   └── resourceGen.ts      # Resource suggestion logic
│   ├── fallback/
│   │   ├── heuristics.ts       # Heuristic fallback logic
│   │   └── localLLM.ts         # Local LLM fallback logic
│   └── types.ts                # TypeScript types/interfaces
├── api/
│   └── lessonGen.ts            # API handler (e.g., for /api/lesson-gen)
├── prompts/
│   └── templates.ts            # LLM prompt templates
├── test/
│   ├── lessonGen.test.ts       # Unit/integration tests
│   └── ...                     # More tests as needed
└── README.md                   # Feature documentation
```

**Key points:**
- This structure is modular, workflow-driven, and decoupled from course logic.
- It matches the separation of concerns and extensibility described in `aiLessonGen.md`.
- The API handler is separate, making it easy to expose as a stateless service.
- All enrichment, fallback, and workflow logic is encapsulated for clarity and maintainability.

---

## 🚀 Implementation Roadmap

### **Sprint 1: Foundation (Week 1)**
- [ ] Define TypeScript types/interfaces for input/output
- [ ] Implement local segmentation (Hugging Face models)
- [ ] Implement basic enrichment (summaries, objectives)
- [ ] Create lesson generation service (stateless function)
- [ ] Expose `/api/lesson-gen` endpoint
- [ ] Add fallback mechanism for quota/usage limits
- [ ] Write unit tests for core logic

### **Sprint 2: Premium & Hybrid Workflows (Week 2)**
- [ ] Integrate cloud LLM APIs (Gemini, Claude)
- [ ] Implement workflow selector logic
- [ ] Add advanced enrichment (exercises, resources)
- [ ] Add usage tracking and rate limiting
- [ ] UI: Display usage limits and fallback status
- [ ] Integration tests for all workflows

### **Sprint 3: QA, Metrics, and Extensibility (Week 3)**
- [ ] Add comprehensive testing (unit, integration, regression)
- [ ] Implement quality metrics (coherence, enrichment, speed)
- [ ] Add analytics/logging for monitoring
- [ ] Support export formats (Markdown, PDF)
- [ ] Document API and usage
- [ ] Plan for onboarding/OAuth for advanced billing (optional)

---

## 🧪 Testing & QA Strategy
- **Unit Tests:** All core utilities and workflow logic
- **Integration Tests:** End-to-end (input → lessons)
- **Mocking:** Simulate LLM/AI responses and failures
- **Regression Tests:** Prevent breaking changes
- **Quality Metrics:**
  - Content coherence
  - Enrichment completeness
  - Processing speed
  - Error/fallback rate

---

## 📊 Success Metrics
- **Content Quality:**
  - Coherence score >85%
  - Logical lesson progression
  - Enrichment (summaries, objectives, exercises) present
- **Technical Performance:**
  - Processing speed <30s for 5000 words
  - AI success rate >90%
  - Error rate <5%
- **User Experience:**
  - Adoption rate >70% for lesson AI
  - Satisfaction score >4.5/5
  - Time savings >50% vs manual

---

## 🛠️ Technical Debt / TODOs
- Replace `console.log` with analytics/logging
- Improve error handling in enrichment/exercise generation
- Expand representative content extraction for prompts
- Refactor and document as new features are added

---

## 🔗 Integration Points & References
- [AI Lesson Generation Architecture](../architecture/aiLessonGen.md)
- [Chunk AI Development Plan](CHUNK_AI_DEVELOPMENT_PLAN.md)
- [Text Structuring Integration](TEXT_STRUCTURING_INTEGRATION.md)
- [Database Schema](../architecture/database-schema.md)
- [MVP Feature Checklist](MVP_Feature_Checklist.md)
- [Central Tasks Tracker](TASKS.md)

---

## 🔮 Future Enhancements
- Multi-language support
- Domain-specific lesson templates
- Collaborative lesson editing
- Advanced AI models (new LLMs)
- Review question (QCM) generation
- Diagram/image generation
- Citation/source generation
- Accessibility and SEO features
- Analytics dashboard for lesson quality
- streaming of lesson 
---

**Last Updated:** {{TODAY}}
**Maintained By:** Learn Hub Development Team 