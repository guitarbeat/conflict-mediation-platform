## 2024-05-23 - Accessibility of Interactive Elements
**Learning:** Icon-only buttons often rely on `title` attributes for accessibility, which is insufficient for screen readers and keyboard users. `aria-label` provides a robust, accessible name for these controls.
**Action:** Always verify that interactive elements like buttons have a descriptive `aria-label`, especially if they don't have visible text labels. Use `title` only as a supplementary tooltip, not as the primary accessible name.
