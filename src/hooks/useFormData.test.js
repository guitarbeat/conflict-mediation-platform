import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFormData } from './useFormData.js';

describe('useFormData validation helpers', () => {
  it('identifies missing fields for step 2', () => {
    const { result } = renderHook(() => useFormData());
    expect(result.current.isStepComplete(2)).toBe(false);
    expect(result.current.getMissingFieldsForStep(2)).toEqual([
      'partyAThoughts',
      'partyAAssertiveApproach',
    ]);

    act(() => {
      result.current.updateFormData('partyAThoughts', 'Thoughts');
    });

    expect(result.current.getMissingFieldsForStep(2)).toEqual([
      'partyAAssertiveApproach',
    ]);
  });
});
