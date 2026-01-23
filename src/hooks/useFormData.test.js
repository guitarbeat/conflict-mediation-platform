import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useFormData } from './useFormData.js';

// Mock useErrorHandler
vi.mock('./useErrorHandler', () => ({
  useErrorHandler: () => ({
    executeAsync: async (fn) => {
      const result = await fn();
      return { success: true, data: result };
    },
  }),
}));

describe('useFormData', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock localStorage
    const getItemMock = vi.fn(() => null);
    const setItemMock = vi.fn();
    const removeItemMock = vi.fn();

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: getItemMock,
        setItem: setItemMock,
        removeItem: removeItemMock,
      },
      writable: true,
      configurable: true
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('identifies missing fields for step 2', () => {
    const { result } = renderHook(() => useFormData());

    expect(result.current.isStepComplete(2, 0)).toBe(false);
    expect(result.current.getMissingFieldsForStep(2, 0)).toEqual(['partyAThoughts']);

    act(() => {
      result.current.updateFormData('partyAThoughts', 'Thoughts');
    });

    expect(result.current.isStepComplete(2, 0)).toBe(true);
  });

  it('debounces saveToStorage calls', async () => {
    // Mock existing data so loadedFromStorage becomes true
    window.localStorage.getItem.mockReturnValue(JSON.stringify({ partyAName: 'Initial' }));

    const { result } = renderHook(() => useFormData());

    // Wait for loadFromStorage to complete
    await waitFor(() => {
      if (!result.current.loadedFromStorage) {
         throw new Error('Not loaded yet');
      }
    }, { timeout: 1000 });

    expect(result.current.loadedFromStorage).toBe(true);

    // Reset mock to clear the initial save or load calls
    window.localStorage.setItem.mockClear();

    // Make multiple updates rapidly
    act(() => {
      result.current.updateFormData('partyAName', 'Alice');
    });

    act(() => {
      result.current.updateFormData('partyAName', 'Alice S');
    });

    act(() => {
      result.current.updateFormData('partyAName', 'Alice Sm');
    });

    // Should not have saved yet because of debounce
    expect(window.localStorage.setItem).not.toHaveBeenCalled();

    // Fast-forward time by 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Wait for the async saveToStorage execution to complete
    await act(async () => {
      await Promise.resolve();
    });

    // Should have saved once now
    expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);

    // Verify the data being saved is the latest
    const lastCall = window.localStorage.setItem.mock.calls[0];
    const savedData = JSON.parse(lastCall[1]);
    expect(savedData.partyAName).toBe('Alice Sm');
  });
});
