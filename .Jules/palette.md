## 2024-05-23 - Radix UI Tooltip & ARIA Merging
**Learning:** When using Radix UI's `TooltipTrigger` with `asChild`, it clones the child element and merges props. However, it may override `aria-disabled` (setting it to `false` or removing it) if not explicitly handled, even if the child element has it set. Explicitly passing `aria-disabled` to the `TooltipTrigger` ensures it is preserved on the final rendered element.
**Action:** Always pass `aria-disabled` to `TooltipTrigger` when wrapping a potentially aria-disabled element, or ensure it's handled in a way that survives the `Slot` prop merging.

## 2024-05-23 - Radix UI Tooltip Testing
**Learning:** Testing Radix UI Tooltips requires a `ResizeObserver` mock in the test environment (e.g., `setupTests.js`). Interaction requires `fireEvent.pointerEnter` (not just `mouseEnter`) and `focus`.
**Action:** Ensure `ResizeObserver` is mocked and use pointer events for tooltip tests.
