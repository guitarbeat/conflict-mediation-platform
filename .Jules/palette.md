## 2024-05-22 - Accessibility of Icon-only Buttons
**Learning:** Icon-only buttons (like password toggles, help icons) are a common accessibility trap. They often rely on `title` or visual cues which are insufficient for screen readers.
**Action:** Always verify that icon-only buttons have an explicit `aria-label` or `sr-only` text describing their action.
