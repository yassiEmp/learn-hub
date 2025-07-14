# Linting Error & Architecture Violation Report

This document lists all places in the codebase where the feature-based architecture and coding guidelines (as described in `docs/README.md`) are violated. Each entry includes the file, line number, and a description of the violation. Use this as a planning document for refactoring and linting rule enforcement.

---

## 1. Cross-Feature Imports (Features importing from other features)

**Rule Violated:** No feature imports code from another feature. Shared logic must be in `shared/`.

### Lesson Generation Feature importing from Course Feature

- `features/lesson-gen/service/workflows/cheap.ts` (lines 2-5)
  - Imports from `../../../course/utils/chunkAI/...`
- `features/lesson-gen/service/workflows/premium.ts` (lines 2-5)
  - Imports from `../../../course/utils/chunkAI/...`
- `features/lesson-gen/service/workflows/hybrid.ts` (lines 2-5)
  - Imports from `../../../course/utils/chunkAI/...`

**Fix:** Move all generic chunkAI utilities to `shared/utils/chunkAI/` and update imports in both features.

---

## 2. Use of Non-Shared Components from Root Components Directory

**Rule Violated:** Features should only use pure, logic-free components from `shared/components/`. Feature-specific components should not be imported from the root `components/` directory.

- `features/import/components/InputSection.tsx` (lines 2-3)
  - Imports `Button` and `Textarea` from `../../../components/ui/` instead of `shared/components/`.
- `features/import/components/Title.tsx` (line 2)
  - Imports `AnimatedTextCycle` from `../../../components/ui/` instead of `shared/components/`.

**Fix:** Move all generic UI components to `shared/components/` and update imports. Feature-specific UI should be in the feature folder.

---

## 3. No HOC Usage for Feature Logic

**Rule Violated:** Feature-specific logic should be added via Higher-Order Components (HOCs) in each feature, not by modifying shared components directly.

- No `hocs/` folders or HOC usage found in any feature.

**Fix:** If feature-specific logic is needed for a shared component, implement it as an HOC in a `hocs/` folder within the feature.

---

## 4. Shared Component Purity (To Be Audited)

**Rule Violated:** Shared components in `shared/components/` must be pure and contain no business logic.

- **Action Needed:** Audit all files in `shared/components/` to ensure they are logic-free. Move any business logic to the appropriate feature or wrap with an HOC.

---

## 5. Absolute Imports of Features (To Be Audited)

**Rule Violated:** No feature should import from another feature using absolute paths (e.g., `@/features/other-feature`).

- No direct violations found, but audit for any such imports as the codebase grows.

---

## 6. General Recommendations

- Move all shared logic/utilities to `shared/`.
- Move all pure UI components to `shared/components/`.
- Add HOC folders to features as needed.
- Enforce these rules with custom ESLint rules or code reviews.

---

**Last updated:** [Fill in date when running this audit] 