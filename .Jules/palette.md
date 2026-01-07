# Palette's Journal

## 2024-05-22 - Initial Setup
**Learning:** Started tracking UX improvements.
**Action:** Will document critical learnings here.

## 2024-05-22 - Desktop Navigation Tooltips
**Learning:** Desktop navigation buttons using `aria-disabled` for validation blocking (split-disabled state) lacked visual feedback for *why* they were blocked.
**Action:** Added `Tooltip` wrappers to desktop navigation buttons. Used `forwardRef` on the custom `NavigationButton` component to make it compatible with `TooltipTrigger`. The tooltip now explicitly says "Complete all required fields" when `aria-disabled` is true, improving the "stuck user" experience.
