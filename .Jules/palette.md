## 2024-05-22 - Nested Interactive Controls
**Learning:** Placing a `<button>` inside a `<label>` is invalid HTML and causes accessibility issues. When a label needs to trigger a file input but look like a button, use a `span` styled as a button (using `asChild` pattern) inside the label.
**Action:** Always verify that interactive elements are not nested. Use `asChild` with `span` for button-like triggers inside labels.

## 2024-05-23 - SmartSuggestions Accessibility Gaps
**Learning:** Collapsible sections like "Smart Suggestions" often miss `aria-controls` linking the trigger to the content, confusing screen reader users about what the button controls. The component also required a strict partial match to show suggestions, which limited testability and potentially user discovery.
**Action:** Always verify `aria-controls` and `aria-expanded` pairs on disclosure widgets. Consider showing default suggestions when input is empty or low-length to improve discoverability.
