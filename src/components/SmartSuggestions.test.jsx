import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SmartSuggestions } from "./SmartSuggestions";

// Mock useDebounce to return the value immediately
vi.mock("../hooks/useDebounce", () => ({
  default: (value) => value,
}));

describe("SmartSuggestions", () => {
  it("renders, toggles, and has correct accessibility attributes", async () => {
    // Use "concerns" to match one of the "thoughts" suggestions
    render(<SmartSuggestions fieldType="thoughts" currentValue="concerns" context={{}} onSuggestionSelect={() => {}} />);

    // Wait for the effect to run and suggestions to be generated
    await waitFor(() => {
        expect(screen.queryByLabelText("Show suggestions")).toBeInTheDocument();
    });

    const toggleButton = screen.getByLabelText("Show suggestions");
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");

    // Check aria-controls is present (it should be there even if closed, pointing to the future list)
    const ariaControls = toggleButton.getAttribute("aria-controls");
    expect(ariaControls).toBeTruthy();

    // Open suggestions
    fireEvent.click(toggleButton);

    expect(toggleButton).toHaveAttribute("aria-expanded", "true");

    // Check if suggestions are visible
    await waitFor(() => {
        expect(screen.getByText(/I feel like my concerns/i)).toBeInTheDocument();
    });

    // Verify the list has the matching ID and correct semantics
    const list = document.getElementById(ariaControls);
    expect(list).toBeInTheDocument();
    expect(list.tagName).toBe("UL");
    expect(list.children.length).toBeGreaterThan(0);
    expect(list.children[0].tagName).toBe("LI");
  });
});
