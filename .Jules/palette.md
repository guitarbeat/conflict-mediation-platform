## 2025-05-23 - Destructive Action Confirmation
**Learning:** High-stakes actions like "Reset Form" located in persistent banners are prone to accidental clicks. Even if "Resumed" text implies safety, a single click wipe is dangerous.
**Action:** Always wrap destructive actions (reset, delete) in an `AlertDialog` confirmation flow, even if the action seems reversible via "undo" (which this wasn't).
