## 2024-05-23 - Confirmation Dialogs for Destructive Actions
**Learning:** Destructive actions (like resetting a form) are critical failure points. Users can click them accidentally. Simple buttons are not enough.
**Action:** Use `AlertDialog` for any action that permanently deletes user data.

## 2024-05-23 - Async UI Testing
**Learning:** UI elements that appear conditionally based on async hooks (like `useEffect` reading `localStorage`) require `findBy*` queries in tests, not `getBy*`. `getBy*` throws immediately if the element is not in the initial render.
**Action:** Default to `findByTestId` or `findByRole` for elements that might appear asynchronously.
