## 2024-05-22 - Nested Interactive Controls
**Learning:** Placing a `<button>` inside a `<label>` is invalid HTML and causes accessibility issues. When a label needs to trigger a file input but look like a button, use a `span` styled as a button (using `asChild` pattern) inside the label.
**Action:** Always verify that interactive elements are not nested. Use `asChild` with `span` for button-like triggers inside labels.
