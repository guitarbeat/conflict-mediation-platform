# TODO

## Validation & Forms
- Migrate steps 4–6 remaining non-required fields to react-hook-form for consistent state (currently only required fields validated)
- Extract per-step form hooks into separate files (e.g., useStep1Form) for readability
- Add submit-on-next hook to touch/validate required fields automatically

## UX & Accessibility
- Replace remaining alerts with toasts (none left, but re-check)
- Add focus management: focus first invalid field on Next when blocked
- Make stepper keyboard accessible (roving tabindex, aria-current)
- Add "Save/Reset" controls to the header consistently across steps

## Performance
- Code-split additional heavy components if any; prefetch Step 2 when finishing Step 1
- Memoize `StepContent` subsections to reduce re-renders

## PWA & Offline
- Add service worker via vite-plugin-pwa (cache assets + optional data cache)
- Provide an offline fallback page and test installability

## Export/Import
- Add CSV export of action steps only
- Add field masking option for private notes on export

## Testing
- Unit tests for hooks with Vitest (useNavigation, useFormData)
- Component tests for StepContent validation states (Testing Library)
- Playwright E2E for full 7-step flow including import/export

## Content & i18n
- Externalize strings for i18n; provide English + template for translations
- Support RTL rendering and locale-aware dates

## Security/Privacy
- Optional passphrase to encrypt localStorage payload
- "Private mode" toggle to disable persistence entirely