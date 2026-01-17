## 2024-05-23 - Performance Opportunity in EnhancedFormField

**Learning:** `EnhancedFormField` recreates its `inputProps` object on every render, causing unnecessary diffing and potential re-renders of the underlying input element. In a large form like `StepContent`, this can add up.

**Action:** Memoize `inputProps` using `useMemo` and wrap the component in `React.memo` to prevent re-renders when parent state changes but props remain the same. However, since `onChange` is passed from parent and often created inline, `React.memo` might not be effective without also stabilizing `onChange`.

**Constraint:** Stabilizing `onChange` in `StepContent` is difficult because it involves many fields. `EnhancedFormField` receives `value` which changes frequently. The main goal is to avoid re-rendering *other* fields when one field changes.

**Plan:**
1. Memoize `EnhancedFormField` using `React.memo`.
2. To make `React.memo` effective, we need to ensure that when `formData` changes, `EnhancedFormField`s for *unchanged* fields do not re-render.
3. `value` prop will be stable for unchanged fields.
4. `onChange` prop is the problem. It is `(value) => updateFormData("field", value)`. This is a new function every time `StepContent` re-renders.

**Strategy:**
Inside `StepContent`, we can use a helper to generate stable handlers, or `EnhancedFormField` can ignore `onChange` changes if we are sure it does the same thing. But that's risky.

Alternative: Modify `EnhancedFormField` to accept `fieldName` and `onFieldChange` (a stable generic handler) instead of `onChange`.
`StepContent` receives `updateFormData` which is stable (from `useFormData`).
If we pass `name="partyAName"` and `onChange={updateFormData}` to `EnhancedFormField`, then `onChange` is stable!

But `EnhancedFormField` expects `onChange(value)`. `updateFormData` expects `(field, value)`.
So `EnhancedFormField` would need to change to call `onChange(name, value)`.
This requires refactoring `EnhancedFormField` and all its usages.

Let's see if we can just do this for `EnhancedFormField`.

Currently:
```jsx
<EnhancedFormField
  value={formData.partyAName}
  onChange={(value) => updateFormData("partyAName", value)}
  ...
/>
```

Proposed:
```jsx
<EnhancedFormField
  name="partyAName"
  value={formData.partyAName}
  onChange={updateFormData} // (field, value) => ...
  ...
/>
```

Then in `EnhancedFormField`:
```jsx
const handleChange = (newValue) => {
   if (name) {
      onChange(name, newValue);
   } else {
      onChange(newValue);
   }
   // ...
}
```

This allows backwards compatibility. If `name` is provided and `onChange` expects 2 args... wait, we can't detect what `onChange` expects easily.
But if we change the contract: if `name` is provided, we assume `onChange` takes `(name, value)`. Or we can add a new prop `onFieldChange`.

Let's check `src/components/StepContent.jsx` again. It uses `updateFormData` everywhere.
`updateFormData` is stable.

If I introduce `onFieldChange` prop to `EnhancedFormField`.

```jsx
// In EnhancedFormField
if (onFieldChange && id) {
  onFieldChange(id, newValue);
} else {
  onChange(newValue);
}
```

Then in `StepContent`:
```jsx
<EnhancedFormField
  id="partyAName"
  value={formData.partyAName}
  onFieldChange={updateFormData}
  ...
/>
```

Now `onFieldChange` is stable. `value` is stable (for unchanged fields). `id` is stable.
So `React.memo(EnhancedFormField)` will work!

This is a valid optimization.

I need to check `StepContent` usage.
There are many `EnhancedFormField`s.
I can update them one by one or regex replace.

But `EnhancedFormField` is also used as `FormField`.
`FormField` passes props down.

Let's verify `updateFormData` stability.
In `src/hooks/useFormData.js`:
```javascript
    const updateFormData = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
```
It is NOT wrapped in `useCallback`.
So `updateFormData` changes on every render of `useFormData`.
`useFormData` is a hook called in `App`.
So `updateFormData` changes on every render of `App`.

So even if I pass `updateFormData`, it changes.
I need to wrap `updateFormData` in `useCallback` in `src/hooks/useFormData.js`.

**Revised Plan:**
1.  Wrap `updateFormData`, `updateMultipleFields`, `resetFormData` in `useCallback` in `src/hooks/useFormData.js`.
2.  Modify `EnhancedFormField` to accept `onFieldChange` which takes `(id, value)`.
3.  Modify `StepContent` to use `onFieldChange={updateFormData}` instead of inline arrow functions for `EnhancedFormField`s where possible.
4.  Wrap `EnhancedFormField` in `React.memo`.

This will reduce re-renders of all form fields when one changes.

Let's verify if `updateFormData` is indeed unstable.
Yes, `const updateFormData = (field, value) => { ... }` inside the hook.

So step 1 is critical.

Also `StepContent` uses `FormField` which wraps `EnhancedFormField`.
`FormField` needs to pass `onFieldChange` down. It spreads `...props` so it should be fine.

Wait, `StepContent` has *a lot* of fields.
I should pick a few heavy steps or do it for all.
`StepContent` is one big file. I can replace `onChange={(value) => updateFormData("field", value)}` with `onFieldChange={updateFormData}`.
The `id` prop is already there and matches the field name in most cases.

Example:
```jsx
<EnhancedFormField
  id="partyAName"
  label="Party A Name"
  value={formData.partyAName}
  onChange={(value) => updateFormData("partyAName", value)}
  ...
/>
```

If I change it to:
```jsx
<EnhancedFormField
  id="partyAName"
  label="Party A Name"
  value={formData.partyAName}
  onFieldChange={updateFormData}
  ...
/>
```
It relies on `id` being "partyAName". In the code above it is.

One edge case:
```jsx
        const handlePartyColorChange = (partyKey, value) => {
        const fieldName = partyKey === "A" ? "partyAColor" : "partyBColor";
        // ...
        updateFormData(fieldName, normalized);
      };
```
Here `onChange` does more than just `updateFormData`.
So `React.memo` won't help here unless `handlePartyColorChange` is memoized.
But for the bulk of text fields (thoughts, descriptions), it is direct `updateFormData`.

The goal is to stop *other* fields from re-rendering.
If I type in "Party A Name", "Conflict Description" shouldn't re-render.
With `React.memo` and stable `updateFormData` passed as `onFieldChange`, "Conflict Description" props will be:
`id`: "conflictDescription" (stable)
`value`: unchanged (stable)
`onFieldChange`: stable
Other props: stable.
So it won't re-render.

This seems like a solid plan.

**Implementation Steps:**
1.  Fix `useFormData.js` to memoize functions.
2.  Modify `EnhancedFormField.jsx` to support `onFieldChange` and use `React.memo`.
3.  Update `StepContent.jsx` to use `onFieldChange` for simple fields.

I will start by fixing the existing tests because I shouldn't commit on broken tests.
The test failure in `App.test.jsx` seems related to "Resumed a previously saved session".
It expects text that might be split.
And `resets the saved session` test fails because spy not called.

I'll check `src/App.test.jsx`.
