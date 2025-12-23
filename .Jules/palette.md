## 2025-05-23 - Keyboard Accessibility in Custom Drag Components
**Learning:** Complex custom interactions like the `EmojiGridMapper` (drag-to-select) often exclude keyboard users. Adding specific `onKeyDown` handlers for arrow keys mapping to spatial movement ensures accessibility without compromising the custom UI.
**Action:** When creating custom drag interfaces, always implement a parallel keyboard navigation handler that modifies the same state (position/coordinates) using arrow keys.
