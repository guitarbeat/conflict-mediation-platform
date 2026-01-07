## 2024-05-23 - Debounce Simulated API Calls
**Learning:** Simulated API calls or expensive computations triggered by user input in `useEffect` must be debounced to prevent excessive execution and re-renders.
**Action:** Use a custom `useDebounce` hook to delay the execution until the user stops typing.
