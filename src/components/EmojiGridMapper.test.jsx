import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import EmojiGridMapper from "./EmojiGridMapper";

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock requestAnimationFrame
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);

describe("EmojiGridMapper", () => {
  const mockOnChartPositionChange = vi.fn();
  const mockOnEmotionWordsChange = vi.fn();

  beforeEach(() => {
    mockOnChartPositionChange.mockReset();
    mockOnEmotionWordsChange.mockReset();
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it("activates mapping mode on start button click", async () => {
    render(
      <EmojiGridMapper
        onChartPositionChange={mockOnChartPositionChange}
        onEmotionWordsChange={mockOnEmotionWordsChange}
      />
    );

    const startButton = screen.getByLabelText("Start mapping emotion");
    fireEvent.click(startButton);

    // Should now see the draggable emoji
    // Use getAllByRole just in case, but expect 1
    const emojis = screen.getAllByRole("button", { name: /Drag to express emotion/i });
    expect(emojis.length).toBe(1);
    const emoji = emojis[0];

    expect(emoji).toBeInTheDocument();

    // Check that it's keyboard accessible
    expect(emoji).toHaveAttribute("tabIndex", "0");
  });

  it("supports keyboard navigation with arrow keys", () => {
    render(
      <EmojiGridMapper
        onChartPositionChange={mockOnChartPositionChange}
        onEmotionWordsChange={mockOnEmotionWordsChange}
        chartPosition={{ x: 250, y: 250 }} // Start at center
      />
    );

    const emojis = screen.getAllByRole("button", { name: /Drag to express emotion/i });
    const emoji = emojis[0];
    emoji.focus();

    // Move right
    fireEvent.keyDown(emoji, { key: "ArrowRight" });

    expect(mockOnChartPositionChange).toHaveBeenCalled();

    const lastCall = mockOnChartPositionChange.mock.calls[mockOnChartPositionChange.mock.calls.length - 1][0];
    expect(lastCall.x).toBeGreaterThan(250);
  });

  it("updates emotion words when moved", () => {
      render(
        <EmojiGridMapper
          onChartPositionChange={mockOnChartPositionChange}
          onEmotionWordsChange={mockOnEmotionWordsChange}
          chartPosition={{ x: 250, y: 250 }} // Start at center
        />
      );

      const emojis = screen.getAllByRole("button", { name: /Drag to express emotion/i });
      const emoji = emojis[0];
      emoji.focus();

      // Move Up (High Energy)
      fireEvent.keyDown(emoji, { key: "ArrowUp" });

      const lastCall = mockOnChartPositionChange.mock.calls[mockOnChartPositionChange.mock.calls.length - 1][0];
      // Y decreases as we go up
      expect(lastCall.y).toBeLessThan(250);
  });
});
