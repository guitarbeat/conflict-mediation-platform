import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';
import { describe, it, expect, vi } from 'vitest';

describe('useDebounce', () => {
  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce value updates', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    expect(result.current).toBe('initial');

    // Update value
    rerender({ value: 'updated', delay: 500 });

    // Value should not update immediately
    expect(result.current).toBe('initial');

    // Fast-forward time by 250ms
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current).toBe('initial');

    // Fast-forward time by another 250ms
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current).toBe('updated');

    vi.useRealTimers();
  });

  it('should reset timer if value changes within delay', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    // Update value
    rerender({ value: 'update1', delay: 500 });

    // Advance 300ms
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('initial');

    // Update value again before previous timer finished
    rerender({ value: 'update2', delay: 500 });

    // Advance 300ms (total 600ms from start, but only 300ms from second update)
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('initial');

    // Advance 200ms more (total 500ms from second update)
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('update2');

    vi.useRealTimers();
  });
});
