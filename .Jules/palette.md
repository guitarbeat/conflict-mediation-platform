## 2024-05-23 - Icon-only buttons need accessible names
**Learning:** Icon-only buttons (like help icons, password toggles) are frequent accessibility offenders. While `title` attributes provide tooltips for mouse users, they are often insufficient for screen readers and touch devices.
**Action:** Always check `EnhancedFormField` and similar utility components for icon buttons and ensure they have explicit `aria-label` attributes.
