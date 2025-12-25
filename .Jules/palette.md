## 2024-05-23 - Accessible Drag-and-Drop Implementation
**Learning:** Custom drag interfaces often exclude keyboard users. Implementing a "click-to-start" + arrow key navigation pattern provides a robust accessible alternative.
**Action:** When building canvas-like interactions, always implement `handleKeyDown` for position updates and ensure focus is managed (e.g., `autoFocus` when mode activates). Also, ensure `click` handlers are not swallowed by `mouseup` drag-end logic by checking for movement.
