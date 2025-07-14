This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

> **Note:** All project tasks and schedules are now tracked centrally in [docs/planning/TASKS.md](docs/planning/TASKS.md). When you schedule a feature or change in a planning file, add its tasks and schedule to this file, with a link back to the original context.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Recent Changes

- Improved text cleaning in the chunk AI preprocessor (preserves emails, numbers, dates, etc.)
- Enhanced chunk AI system for lesson generation (semantic chunking, better orchestration)
- Representative content extraction for LLM title/description generation
- TODOs added for analytics/database logging and improved error handling

## 🏗️ Feature-Based Architecture & Coding Guidelines

This project uses a **feature-based architecture** with strict separation between features and a shared UI/component library. Each feature is self-contained and independent, with no dependencies on other features. Shared components are pure and logic-free, and feature-specific logic is added via Higher-Order Components (HOCs).

### 🔹 Key Principles
- **Feature Isolation:**
  - Each feature lives in its own folder under `features/` and manages its own UI, API, state, and logic.
  - **No feature imports code from another feature.**
  - Features only use generic utilities/components from `shared/`.
- **Shared Components Are Pure:**
  - Shared components (e.g., Button, Modal) in `shared/components/` contain no business logic.
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
shared/
  └── components/
      └── Button.tsx
```

### 🔹 Coding Best Practices
- **Never import from another feature’s folder.**
- **If logic is shared, move it to `shared/` and keep it generic.**
- **Use HOCs in each feature to add custom logic to shared components.**
- **Keep shared components free of business logic.**

### 🔹 ESLint Rules Enforcing This
- `import/no-cycle`: Prevents cross-feature dependencies.
- `import/no-extraneous-dependencies`: Ensures only allowed imports.
- `import/order`: Keeps imports organized.
- React/TypeScript rules for best practices.

### 🔹 Why This Matters
- **Scalable:** Add new features without breaking others.
- **Maintainable:** Shared components are never polluted with business logic.
- **Testable:** Each feature can be tested in isolation.

For more details, see `.eslintrc.js` and the `/shared/components/` folder.
