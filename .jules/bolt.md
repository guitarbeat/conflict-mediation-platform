# Bolt's Journal

## 2024-05-23 - React Performance Patterns
**Learning:** Anonymous functions passed as props (e.g., `onChange={() => ...}`) defeat `React.memo` optimizations because they create new function references on every render.
**Action:** Use stable handlers (via `useCallback`) and implement specialized props like `onFieldChange(id, value)` in child components to allow parents to pass stable callbacks without inline closures.

**Learning:** Deep object creation in helper functions (like `getPartyFieldProps`) returning new object references every time breaks memoization of consumers.
**Action:** Use `useMemo` to stabilize derived data objects and ensure helper functions return stable references when inputs haven't changed, or memoize the result at the call site.

## 2024-05-23 - Unused Code
**Learning:** Unused components (like `ParticleBackground.jsx`) clutter the codebase and should be removed.
**Action:** Regularly audit for and remove unused files.
