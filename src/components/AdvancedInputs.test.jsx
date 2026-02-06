import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MultiSelectInput } from "./AdvancedInputs";

afterEach(() => {
  cleanup();
});

describe("MultiSelectInput Accessibility", () => {
  it("focuses trigger when label is clicked", () => {
    render(
      <MultiSelectInput
        id="test-input"
        label="Test Label"
        value={[]}
        onChange={() => {}}
      />
    );

    const label = screen.getByText("Test Label");
    fireEvent.click(label);

    const trigger = screen.getByText("Select options...").closest(".form-input");

    // Expect failure here currently
    expect(document.activeElement).toBe(trigger);
  });

  it("is reachable via keyboard", () => {
    render(
      <MultiSelectInput
        id="test-input"
        label="Test Label"
        value={[]}
        onChange={() => {}}
      />
    );

    const trigger = screen.getByText("Select options...").closest(".form-input");
    // Expect failure here currently
    expect(trigger).toHaveAttribute("tabindex", "0");
  });

  it("opens on Enter key", () => {
    render(
      <MultiSelectInput
        id="test-input"
        label="Test Label"
        value={[]}
        onChange={() => {}}
        options={["Option 1"]}
      />
    );

    const trigger = screen.getByText("Select options...").closest(".form-input");
    fireEvent.keyDown(trigger, { key: "Enter" });

    // Expect failure here currently
    expect(screen.getByPlaceholderText("Search options...")).toBeInTheDocument();
  });

  it("closes on Escape key and returns focus to trigger", () => {
    render(
      <MultiSelectInput
        id="test-input"
        label="Test Label"
        value={[]}
        onChange={() => {}}
        options={["Option 1"]}
      />
    );

    const trigger = screen.getByText("Select options...").closest(".form-input");

    // Open it first (click works currently)
    fireEvent.click(trigger);
    const searchInput = screen.getByPlaceholderText("Search options...");
    expect(searchInput).toBeInTheDocument();

    searchInput.focus();

    // Press Escape
    fireEvent.keyDown(searchInput, { key: "Escape" });

    expect(screen.queryByPlaceholderText("Search options...")).not.toBeInTheDocument();

    // Expect failure here currently (focus return)
    expect(document.activeElement).toBe(trigger);
  });
});
