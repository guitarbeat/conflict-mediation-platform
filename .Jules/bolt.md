## 2024-05-22 - RAF Stacking in Hooks
**Learning:** Using `requestAnimationFrame` directly inside a high-frequency event handler (like `mousemove`) without cancelling the previous frame causes callback stacking. This defeats the purpose of throttling and can lead to redundant calculations per frame.
**Action:** Always store the `requestID` in a `ref` and call `cancelAnimationFrame` before scheduling a new frame in drag/scroll handlers.

## 2024-05-24 - Event Listener Stability in Effects
**Learning:** Passing unstable event handlers to effects that attach/detach listeners (e.g., in `CardStack`) causes listeners to be removed and re-added on every render (or every frame during drag), leading to performance degradation.
**Action:** Always memoize event handlers passed to components that use them in `useEffect` dependencies for event binding.
