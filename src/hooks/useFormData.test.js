import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFormData } from './useFormData.js';

describe('useFormData validation helpers', () => {
  it('identifies missing fields for step 2', () => {
    const { result } = renderHook(() => useFormData());

    // Sub-step 0
    expect(result.current.isStepComplete(2, 0)).toBe(false);
    expect(result.current.getMissingFieldsForStep(2, 0)).toEqual([
      'partyAThoughts',
    ]);

    act(() => {
      result.current.updateFormData('partyAThoughts', 'Thoughts');
    });

    expect(result.current.isStepComplete(2, 0)).toBe(true);
    expect(result.current.getMissingFieldsForStep(2, 0)).toEqual([]);

    // Sub-step 1
    expect(result.current.isStepComplete(2, 1)).toBe(true);
    expect(result.current.getMissingFieldsForStep(2, 1)).toEqual([]);

    // Sub-step 2
    expect(result.current.isStepComplete(2, 2)).toBe(false);
    expect(result.current.getMissingFieldsForStep(2, 2)).toEqual([
        'partyAAssertiveApproach',
    ]);

    act(() => {
        result.current.updateFormData('partyAAssertiveApproach', 'Assertive approach');
    });

    expect(result.current.isStepComplete(2, 2)).toBe(true);
    expect(result.current.getMissingFieldsForStep(2, 2)).toEqual([]);
  });

  it('getStepData returns correct fields based on dependencies', () => {
    const { result } = renderHook(() => useFormData());

    // Set some data
    act(() => {
        result.current.updateFormData('partyAName', 'Alice');
        result.current.updateFormData('conflictDescription', 'Problem');
        result.current.updateFormData('partyAThoughts', 'Thinking');
    });

    // Step 1 should have Name and Description but NOT Thoughts
    const step1Data = result.current.getStepData(1);
    expect(step1Data.partyAName).toBe('Alice');
    expect(step1Data.conflictDescription).toBe('Problem');
    expect(step1Data.partyAThoughts).toBeUndefined();

    // Step 2 should have Name (Global) and Thoughts but NOT Description
    const step2Data = result.current.getStepData(2);
    expect(step2Data.partyAName).toBe('Alice');
    expect(step2Data.partyAThoughts).toBe('Thinking');
    expect(step2Data.conflictDescription).toBeUndefined();
  });
});
