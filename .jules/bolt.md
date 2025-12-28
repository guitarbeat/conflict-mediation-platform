## 2024-05-23 - Heavy Render Performance in Form Steps
**Learning:** Large form components (`StepContent`) that re-calculate derived data (colors, styles) and create new object/function props on every render cause significant unnecessary work, especially when rendered multiple times by a virtualized or stacked layout (like `CardStack`).
**Action:** Memoize expensive calculations (color normalization, style generation) and derived objects/functions (`partyDetails`, `getPartyFieldProps`) using `useMemo` and `useCallback` to stabilize props passed to children and reduce render cost.
