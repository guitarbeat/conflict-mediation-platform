## 2024-05-24 - Test Failures in Resume Banner
**Learning:** `App.test.jsx` fails to find "Resumed a previously saved session from this device." and the reset button functionality fails.
**Context:** This happens even before my changes (I assume, as my changes were only adding `useCallback`). The error message `Unable to find an element with the text...` suggests the banner is not rendering or the text is split.
**Investigation:** The banner renders if `loadedFromStorage` is true. `useFormData` hook likely mocks `loadedFromStorage`.
**Action:** I need to verify if my changes caused this or if the tests were already broken. I'll revert my changes to `App.jsx` temporarily to check if tests pass without them.
