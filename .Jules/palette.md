## 2024-05-22 - Nested Interactive Controls
**Learning:** Placing a `<button>` inside a `<label>` is invalid HTML and causes accessibility issues. When a label needs to trigger a file input but look like a button, use a `span` styled as a button (using `asChild` pattern) inside the label.
**Action:** Always verify that interactive elements are not nested. Use `asChild` with `span` for button-like triggers inside labels.

## 2024-05-23 - Dynamic List Association
**Learning:** Toggle buttons controlling conditional content (like suggestion lists) often lack `aria-controls` pointing to the content's ID, breaking the semantic relationship for screen readers. Using `React.useId()` ensures unique IDs for these associations.
**Action:** When creating toggleable content, generate a unique ID, apply it to the content container, and link it via `aria-controls` on the trigger button.
