<!-- 4903f8ca-2633-405a-ad60-0b6c5421d209 39724ba7-029e-4ddc-92e7-753d74a143b6 -->
# Implement Context Caching with Raw Text

## Overview

Cache all static content (system prompt + book + format instructions + lesson content) as raw text in a single cache. Use this cache for exam generation, then pass conversation history for explanation generation.

## Key Changes

1. **Refactor prompt.ts** to use functions that accept format instructions
2. **Embed format instructions as raw text** in the cache via prompt functions
3. **Cache static content**: system + book + format + lesson content
4. **Keep numberOfExercises as parameter** in user message (not cached) so cache remains valid for different exercise counts

## Implementation

### Update `features/exam/ai/ai.ts`

**Add imports:**

```typescript
import { genai } from "@google/generative-ai";
import type { CachedContent } from "@google/generative-ai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
```

**Add fields:**

```typescript
private genaiClient: genai.Client;
private cachedContent: CachedContent | null = null;
private examRequest: string = "";
private examResponse: any = null;
```

**Update constructor:**

```typescript
this.genaiClient = new genai.Client({
    apiKey: process.env.GOOGLE_API_KEY
});
```

**Rewrite `generateExam` (with numberOfExercises parameter):**

```typescript
async generateExam(content: string, numberOfExercises: string = "20") {
    // Build system instruction with format requirements (NO exercise count here!)
    const systemInstruction = `${prompt.systemWithFormat(examParser.getFormatInstructions())}

Here is a custom book with exam creation principles:
${prompt.book}`;

    // Create cache with static content (system + book + lesson content)
    // NOTE: numberOfExercises is NOT in the cache!
    const cache = await this.genaiClient.caches.create({
        model: "models/gemini-2.0-flash-exp",
        config: {
            display_name: "Exam Cache",
            system_instruction: systemInstruction,
            contents: [{
                role: "user",
                parts: [{ text: prompt.userContentPrompt(content) }]
            }],
            ttl: "3600s",
        },
    });
    
    this.cachedContent = cache;
    
    const cachedLlm = new ChatGoogleGenerativeAI({
        model: "gemini-2.0-flash-exp",
        apiKey: process.env.GOOGLE_API_KEY,
        temperature: 0.2,
        maxOutputTokens: 4000,
        cached_content: cache.name,
    });
    
    // Number of exercises is passed as a NEW message (not cached)
    // This allows changing the count without invalidating the cache
    this.examRequest = prompt.examGenerationPrompt(numberOfExercises);
    const response = await cachedLlm.invoke([
        new HumanMessage(this.examRequest)
    ]);
    
    const parsedExam = await examParser.parse(response.content as string);
    this.examResponse = parsedExam;
    
    return parsedExam;
}
```

**Rewrite `generateExplanation`:**

```typescript
async generateExplanation() {
    if (!this.cachedContent || !this.examResponse) {
        throw new Error("Must call generateExam first");
    }
    
    if (this.config.cost === "low") {
        return {};
    }
    
    const cachedLlm = new ChatGoogleGenerativeAI({
        model: "gemini-2.0-flash-exp",
        apiKey: process.env.GOOGLE_API_KEY,
        temperature: 0.2,
        maxOutputTokens: 4000,
        cached_content: this.cachedContent.name,
    });
    
    const explanationPrompt = `${prompt.explanation}

EXPLANATION FORMAT:
${explanationParser.getFormatInstructions()}`;
    
    const response = await cachedLlm.invoke([
        new HumanMessage(this.examRequest),
        new AIMessage(JSON.stringify(this.examResponse)),
        new HumanMessage(explanationPrompt)
    ]);
    
    return await explanationParser.parse(response.content as string);
}
```

**Add cleanup:**

```typescript
async cleanup() {
    if (this.cachedContent) {
        await this.genaiClient.caches.delete(this.cachedContent.name);
        this.cachedContent = null;
    }
}
```

## Why This Works

- All static content (system, book, format, lesson) cached once
- Exam generation: simple request on top of cache
- Explanation: reuses cache + passes exam via conversation history
- No template variables, no re-caching, maximum efficiency

## Files to Modify

- `features/exam/ai/ai.ts`

### To-dos

- [ ] Verify @google/generative-ai package version supports caching
- [ ] Add Google GenAI SDK imports to ai.ts
- [ ] Add private fields for genaiClient, cachedContent, and examResponse
- [ ] Initialize GenAI client in constructor
- [ ] Implement generateExam with cache creation and cached LLM usage
- [ ] Implement generateExplanation to reuse cached context
- [ ] Add cleanup method to delete cache when done
- [ ] Update explanation prompt template to include exam context