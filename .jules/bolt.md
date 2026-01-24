# Bolt's Journal

## 2024-05-23 - Memoization of Dynamic Components
**Learning:** `StepContent` was memoized, but `renderStepContent` was an inline function in `App.jsx`, causing `CardStack` to receive a new `children` prop (or rather, the function prop `renderStepContent` was new) on every render.
**Action:** Use `useCallback` for functions passed as props, especially if they are used in `render` methods of children. In this case, `App.jsx` re-rendered on drag (due to `dragOffset` state), which caused `renderStepContent` to be recreated. `CardStack` then re-rendered. Although `StepContent` is memoized, `CardStack`'s other children logic runs.

## 2024-05-23 - React Element Creation
**Learning:** Even if `StepContent` is memoized, calling `renderStepContent(step)` inside `CardStack` creates a *new* React Element object. React then diffs this against the old one. If props are stable, `StepContent` (the component) doesn't re-render. BUT `CardStack` does re-render.
**Action:** The bottleneck is likely `CardStack` re-rendering on every drag frame.

## 2024-05-23 - Heavy Components and Inline Objects
**Learning:** `StepContent.jsx` creates `context` object inline: `const context = { partyAName: ... }`. This object is passed to `SmartSuggestions`. `SmartSuggestions` uses `useDebounce(currentValue)`.
If `StepContent` re-renders (e.g. while typing), `context` is recreated. `SmartSuggestions` props change. `SmartSuggestions` re-renders.
**Action:** Memoize `context` object in `StepContent`.

## 2024-05-24 - Centralized Dependency Management for Memoization
**Learning:** When memoizing components that rely on subsets of a large state object (like `formData`), manually maintaining a dependency list in `arePropsEqual` is fragile.
**Action:** Consolidate the dependency logic into a single source of truth (`stepDependencies.js`) and use it in both the component's memoization logic AND the data accessor hooks (`getStepData` in `useFormData`). This ensures the logic stays in sync and is verifiable via unit tests.
