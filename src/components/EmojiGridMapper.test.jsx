import { render, screen } from '@testing-library/react';
import React from 'react';
import { vi, describe, it, expect } from 'vitest';
import EmojiGridMapper from './EmojiGridMapper';

// Simplify mock to just render children
vi.mock('./ui/badge', () => {
  return {
    Badge: ({ children }) => children,
  };
});

describe('EmojiGridMapper', () => {
  it('renders emotion words as buttons when emoji is placed', () => {
    const props = {
        onEmotionWordsChange: vi.fn(),
        onChartPositionChange: vi.fn(),
        selectedEmotionWords: [],
        chartPosition: { x: 250, y: 250 },
    };
    render(<EmojiGridMapper {...props} />);

    // Check if a specific word exists and is a button
    // We use getAllByText because sometimes words can appear in multiple lists (e.g. recommended vs all),
    // although they should be filtered.
    const wordElements = screen.getAllByText('confused');
    expect(wordElements.length).toBeGreaterThan(0);
    expect(wordElements[0].tagName).toBe('BUTTON');
    expect(wordElements[0]).toHaveAttribute('type', 'button');

    const buttons = screen.getAllByRole('button');
    // Filter out the main emoji drag button (it has aria-label starting with "Drag to express emotion")
    const emotionButtons = buttons.filter(btn =>
        !btn.getAttribute('aria-label')?.includes("Drag to express emotion")
    );

    expect(emotionButtons.length).toBeGreaterThan(0);
  });
});
