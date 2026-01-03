import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';
import { describe, it, expect, vi } from 'vitest';

describe('useDebounce', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce value updates', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    // Update value
    rerender({ value: 'updated', delay: 500 });

    // Should still be initial value immediately after update
    expect(result.current).toBe('initial');

    // Advance time by 200ms (less than delay)
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('initial');

    // Advance time by remaining 300ms
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('updated');

    vi.useRealTimers();
  });

  it('should reset timer if value changes before delay', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    // Update to 'update1'
    rerender({ value: 'update1', delay: 500 });

    // Advance 300ms
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('initial');

    // Update to 'update2' before first timer fires
    rerender({ value: 'update2', delay: 500 });

    // Advance another 300ms (total 600ms from start, but only 300ms since last update)
    act(() => {
      vi.advanceTimersByTime(300);
    });
    // Should still be initial because the timer reset
    expect(result.current).toBe('initial');

    // Advance another 200ms (total 500ms since last update)
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('update2');

    vi.useRealTimers();
  });
});
