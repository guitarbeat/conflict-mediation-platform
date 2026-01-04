# Bolt's Journal

## 2024-05-23 - ParticleBackground Optimization
**Learning:** `ParticleBackground` is a purely visual component that re-renders unnecessarily on every parent update because it's not memoized. Even though it's light, it runs `useEffect` cleanup and setup on mount/unmount if the parent unmounts it (which it doesn't here, but good practice). More importantly, if `App` re-renders, React has to reconcile `ParticleBackground`. Since it has no props, `React.memo` makes it essentially free after mount.
**Action:** Wrap `ParticleBackground` in `React.memo` to prevent reconciliation when `App` state changes (which happens frequently during drag/input).

## 2024-05-23 - App Structure and Memoization
**Learning:** `App.jsx` passes `renderStepContent` to `CardStack`. This function is defined inline? No, it's an arrow function assigned to a variable, but it's NOT wrapped in `useCallback`. Wait, checking `App.jsx`:
```javascript
  const renderStepContent = (step) => {
    return (
      <StepContent ... />
    );
  };
```
This function is recreated on *every* render of `App`.
`CardStack` receives this new function every time.
If `CardStack` is memoized (I need to check), this prop change breaks memoization.
If `CardStack` is NOT memoized, it re-renders anyway.

**Action:** `renderStepContent` should be wrapped in `useCallback`.
**Action:** `CardStack` should be checked for `React.memo`.

## 2024-05-23 - Canvas Performance
**Learning:** `ParticleBackground` clears the entire canvas and redraws 50 particles every frame. It uses `ctx.save()`/`restore()` which are expensive. Since we can control global state, we can avoid these.
**Action:** Optimize `draw` loop in `ParticleBackground`.
