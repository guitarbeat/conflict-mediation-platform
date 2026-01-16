## 2024-05-22 - Artificial Latency Removal
**Learning:** The codebase contained `SmartSuggestions` component with intentional artificial latency (500ms `setTimeout`) to simulate an API call for static local data.
**Action:** Always check for `setTimeout` or "simulated" async operations in "smart" or "AI" named components. Removing them provides instant performance wins without complex logic changes.
