import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { SmartSuggestions, ContextualHelp } from "./SmartSuggestions";

// Mock Tooltip components
vi.mock("./ui/tooltip", () => ({
  Tooltip: ({ children }) => <div>{children}</div>,
  TooltipTrigger: ({ children }) => <div>{children}</div>,
  TooltipContent: ({ children }) => <div>{children}</div>,
}));

describe("SmartSuggestions", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("debounces input updates", async () => {
    const { rerender } = render(
      <SmartSuggestions fieldType="conflictDescription" currentValue="" />
    );

    expect(screen.queryByText("Smart Suggestions")).not.toBeInTheDocument();

    rerender(
      <SmartSuggestions
        fieldType="conflictDescription"
        currentValue="Communication"
      />
    );

    // Should not show immediately due to debounce delay
    expect(screen.queryByText("Smart Suggestions")).not.toBeInTheDocument();

    // Fast-forward debounce time
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    // Now it should appear
    expect(screen.getAllByText("Smart Suggestions")[0]).toBeInTheDocument();
  });

  it("filters suggestions", async () => {
    const { rerender } = render(
        <SmartSuggestions fieldType="conflictDescription" currentValue="" />
    );

    rerender(
      <SmartSuggestions
        fieldType="conflictDescription"
        currentValue="breakdown"
      />
    );

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getAllByText("Smart Suggestions")[0]).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Show suggestions"));

    expect(screen.getByText("Communication breakdown between team members")).toBeInTheDocument();
    expect(screen.queryByText("Personality clash affecting work collaboration")).not.toBeInTheDocument();
  });
});
