# 🧪 Chunk AI & Course Features Testing Strategy

## 📋 Overview
This document outlines the testing strategy for the enhanced chunk AI and course generation features in Learn Hub. The goal is to ensure robust, reliable, and maintainable code through comprehensive automated and manual testing.

## 🎯 Scope
- `generateLessons` function (all styles: markdown, aiGen, chunk)
- Enhanced chunk AI pipeline (text cleaning, sentence splitting, semantic chunking, lesson orchestration)
- Utility functions (representative content extraction, AI client, etc.)
- Error handling, logging, and fallback logic

## 🔑 Key Areas to Test
- **Lesson Generation:** Output structure, correctness, and fallbacks
- **Text Preprocessing:** Cleaning, sentence splitting, and preservation of key info
- **Semantic Chunking:** Meaningful grouping and topic detection
- **LLM Integration:** Prompt construction, response parsing, and caching
- **Error Handling:** Robustness to AI failures and parsing errors

## 🧩 Types of Tests
- **Unit Tests:** For all core utilities and functions
- **Integration Tests:** End-to-end pipeline (input text → lessons)
- **Mocking:** Simulate LLM/AI responses and failures
- **Regression Tests:** Prevent breaking changes

## 🛠️ Tools & Frameworks
- **Jest** (with ts-jest for TypeScript)
- **Mock Service Worker (msw)** or similar for mocking API/AI

## 🗂️ Test File Structure
```
features/course/utils/
  ├── generateLessons.test.ts
  └── chunkAI/
        ├── test-text-cleaning.ts
        ├── test-sentence-splitter.ts
        ├── test-semantic-chunker.ts
        ├── test-aiClient.ts
        └── test-integration.ts
```

## ✅ Next Steps
1. Scaffold and/or update test files as above
2. Write/expand tests for each key area
3. Run tests and review coverage
4. Iterate and improve based on results

## 📈 Success Criteria
- High test coverage for all core logic
- All critical paths and edge cases tested
- Fallbacks and error handling verified
- Tests are maintainable and easy to run

---

*This strategy will be executed and updated as the system evolves. See the main development plan for progress tracking.* 