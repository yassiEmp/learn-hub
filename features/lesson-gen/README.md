# 🧠 Lesson Generation Feature

This feature provides AI-powered lesson generation for Learn Hub, transforming raw educational content into structured, engaging lessons using workflow-driven AI pipelines. It supports multiple business-level workflows (cheap, premium, hybrid) and robust fallback mechanisms.

## Overview
- Stateless, workflow-driven service
- No direct DB interaction
- Returns array of lesson objects
- Modular, extensible, and decoupled from course logic

## API
- `POST /api/lesson-gen`
- Input: `LessonInput`
- Output: `Lesson[]`

## Workflows
- **Cheap:** Local segmentation, basic enrichment (Hugging Face, small LLM)
- **Premium:** Cloud LLM APIs (Gemini, Claude) for advanced rewriting
- **Hybrid:** Local segmentation + cloud enrichment LLM
- **Fallbacks:** Heuristic/local if fails/quota exceeded

## File Structure
```
service/
  index.ts                # Main entry for lesson generation logic
  workflows/
    cheap.ts              # Cheap workflow implementation
    premium.ts            # Premium workflow implementation
    hybrid.ts             # Hybrid workflow implementation
  enrichment/
    summarizer.ts         # Summaries/objectives logic
    exerciseGen.ts        # Exercise generation logic
    resourceGen.ts        # Resource suggestion logic
  fallback/
    heuristics.ts         # Heuristic fallback logic
    localLLM.ts           # Local LLM fallback logic
  types.ts                # TypeScript types/interfaces
api/
  lessonGen.ts            # API handler (e.g., for /api/lesson-gen)
prompts/
  templates.ts            # LLM prompt templates
test/
  lessonGen.test.ts       # Unit/integration tests
  ...                     # More tests as needed
README.md                 # Feature documentation
```

## References
- See `docs/planning/LESSON_GENERATION_PLAN.md` for the full development plan. 

## Testing

- Unit tests are located in `test/lessonGen.test.ts`.
- To run the tests, use your project's test runner (e.g., `npm test` or `npx vitest`).
- Tests cover all workflows and ensure the service returns the expected structure. 