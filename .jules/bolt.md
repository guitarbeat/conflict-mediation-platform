## 2025-01-01 - Missing Dependencies
**Learning:** The environment has many missing dependencies in `package.json` vs what `npm list` reports. This might cause issues when running tests or the app.
**Action:** Be aware that some imports might fail if dependencies are not actually installed or if `pnpm` handles them differently.
