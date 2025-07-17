# Font Consistency Update Plan

## Current Typography Hierarchy Issues:
- Section separators: `text-base font-medium`
- Form labels: `text-sm font-medium` → should be `text-base font-medium`
- Large section labels: `text-lg font-semibold` → should be `text-base font-semibold`
- Input/textarea text: `text-base`
- Description text: `text-sm text-muted-foreground`

## Proposed Consistent Typography:
- **Section separators**: `text-base font-medium` ✓
- **Form labels**: `text-base font-medium` (updated)
- **Section labels**: `text-base font-semibold` (reduced from text-lg)
- **Input/textarea text**: `text-base` ✓
- **Description text**: `text-sm text-muted-foreground` ✓