## 2024-05-23 - [Debounce Optimization & Test Stability]
**Learning:** Testing components with async behavior (like `useEffect` with timeouts or data loading) requires using `findBy*` queries or `waitFor` in tests. `getBy*` queries run synchronously and will fail if the element appears after a delay.
**Action:** Always use `await screen.findByText(/.../)` for elements that appear asynchronously, and wrap assertions dependent on async state updates in `waitFor`. When implementing debounce, ensure corresponding tests account for the delay.
