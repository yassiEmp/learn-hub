# 📚 Documentation Overview

Welcome to the Learn Hub documentation! This directory is organized for clarity and scalability. Here’s how to find what you need:

## Structure

- **planning/**: Project planning, MVP, roadmap, and feature checklists
- **architecture/**: System, database, and technical architecture
- **api/**: API reference and authorization guides
- **guidelines/**: Coding standards and best practices
- **setup/**: Setup, deployment, and troubleshooting
- **product/**: Product vision and business docs

## Entry Points

- For project planning and tasks: `planning/TASKS.md`
- For technical/system architecture: `architecture/SYSTEM_OVERVIEW.md`
- For API reference: `api/API_REFERENCE.md`
- For coding standards: `guidelines/CODING_STANDARDS.md`
- For setup and deployment: `setup/SETUP.md`
- For product vision: `product/APP_DESCRIPTION.md`

---

> **Note:** All internal links and references have been updated to match this structure. If you add new docs, please place them in the appropriate folder. 

## 🏗️ Feature-Based Architecture & Coding Guidelines

This project uses a **feature-based architecture** with strict separation between features and a set of shared UI/component files. Each feature is self-contained and independent, with no dependencies on other features. Shared components are pure and logic-free, and feature-specific logic is added via Higher-Order Components (HOCs).

### 🔹 Key Principles
- **Feature Isolation:**
  - Each feature lives in its own folder under `features/` and manages its own UI, API, state, and logic.
  - **No feature imports code from another feature.**
  - Features only use generic utilities/components from the root-level `components/` directory (including `components/ui/`).
- **Shared Components Are Pure:**
  - Shared components (e.g., Button, Modal) are located in the root `components/` directory (such as `components/ui/`) and contain no business logic.
  - If a feature needs a variation, it wraps the shared component with an HOC in its own folder.
- **HOCs for Feature Logic:**
  - HOCs are used to add feature-specific behavior to shared components, keeping the base components clean and reusable.

### 🔹 Folder Structure Example
```
features/
  ├── courses/
  │   ├── api/
  │   ├── hooks/
  │   ├── hocs/
  │   └── components/
  ├── admin/
  │   ├── api/
  │   ├── hooks/
  │   ├── hocs/
  │   └── components/
components/
  └── ui/
      └── Button.tsx
```

### 🔹 Coding Best Practices
- **Never import from another feature’s folder.**
- **If logic is shared, move it to a root-level folder (like `components/ui/`) and keep it generic.**
- **Use HOCs in each feature to add custom logic to shared components.**
- **Keep shared components free of business logic.**

> **Note:** The term "shared" refers to the convention of using root-level folders (like `components/` or `components/ui/`) for generic, reusable code. There is no `shared/` directory in the project.

### 🔹 ESLint Rules Enforcing This
- `import/no-cycle`: Prevents cross-feature dependencies.
- `import/no-extraneous-dependencies`: Ensures only allowed imports.
- `import/order`: Keeps imports organized.
- React/TypeScript rules for best practices.

### 🔹 Why This Matters
- **Scalable:** Add new features without breaking others.
- **Maintainable:** Shared components are never polluted with business logic.
- **Testable:** Each feature can be tested in isolation.

For more details, see `.eslintrc.js` and the `/components/ui/` folder. 

### 🔹 Error Handling Convention

All async functions in this codebase (especially those that interact with external services or LLMs) **never throw errors**. Instead, they always return an object of the form `{ err, res }`:

```ts
// Example: Error-as-value pattern
export type Result<T> = { err: null; res: T } | { err: unknown; res: null };

export async function doSomething(): Promise<Result<SomeType>> {
  try {
    // ... logic ...
    return { err: null, res: result };
  } catch (err) {
    return { err, res: null };
  }
}
```

- If successful, `err` is `null` and `res` is set.
- If failed, `err` contains the error (usually an Error or string), and `res` is `null`.
- Consumers must always check the `err` field before using `res`.

**Why?**
- This makes error handling explicit and consistent across the codebase.
- It avoids unhandled promise rejections and makes async flows easier to reason about.
- It is especially useful for API and LLM logic, where errors are common and should be handled gracefully. 