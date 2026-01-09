import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { vi, describe, it, expect, afterEach } from "vitest";
import NavigationButtons from "./NavigationButtons";
import { TooltipProvider } from "./ui/tooltip";

// Enforce cleanup
afterEach(() => {
  cleanup();
});

// Helper to wrap component with TooltipProvider if needed
const renderComponent = (props) => {
  return render(
    <TooltipProvider delayDuration={0}>
      <NavigationButtons {...props} />
    </TooltipProvider>
  );
};

describe("NavigationButtons", () => {
  it("renders next button", () => {
    renderComponent({
      currentStep: 1,
      totalSteps: 3,
      onNavigate: vi.fn(),
      isAnimating: false,
      canGoNext: true
    });

    const buttons = screen.getAllByLabelText("Next step");
    const desktopButton = buttons.find(b => b.className.includes("rounded-full"));

    expect(desktopButton).toBeInTheDocument();
  });

  it("renders aria-disabled next button with tooltip when canGoNext is false", async () => {
    renderComponent({
      currentStep: 1,
      totalSteps: 3,
      onNavigate: vi.fn(),
      isAnimating: false,
      canGoNext: false // This triggers aria-disabled and tooltip
    });

    // Find the desktop button
    const buttons = screen.getAllByLabelText("Next step");
    const desktopButton = buttons.find(b => b.className.includes("rounded-full"));

    // Check aria-disabled
    expect(desktopButton).toHaveAttribute("aria-disabled", "true");

    // Trigger tooltip
    fireEvent.pointerMove(desktopButton);
    fireEvent.pointerEnter(desktopButton);
    fireEvent.focus(desktopButton);

    // Wait for tooltip
    const tooltip = await screen.findByRole("tooltip", { name: /Complete all required fields/i });
    expect(tooltip).toBeInTheDocument();
  });
});
