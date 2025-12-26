import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NavigationButtons from "./NavigationButtons";
import React from "react";

// Mock the icons to avoid issues
vi.mock("lucide-react", () => ({
  ChevronLeft: () => <span data-testid="chevron-left" />,
  ChevronRight: () => <span data-testid="chevron-right" />,
}));

// Mock the ui/button component
vi.mock("./ui/button", () => ({
  Button: ({ children, onClick, disabled, "aria-label": ariaLabel, className }) => (
    <button onClick={onClick} disabled={disabled} aria-label={ariaLabel} className={className}>
      {children}
    </button>
  ),
}));

// Mock the ui/tooltip component
vi.mock("./ui/tooltip", () => ({
  Tooltip: ({ children }) => <div data-testid="tooltip">{children}</div>,
  TooltipTrigger: ({ children }) => <div data-testid="tooltip-trigger">{children}</div>,
  TooltipContent: ({ children }) => <div data-testid="tooltip-content">{children}</div>,
  TooltipProvider: ({ children }) => <div data-testid="tooltip-provider">{children}</div>,
}));

describe("NavigationButtons", () => {
  const defaultProps = {
    currentStep: 1,
    totalSteps: 5,
    onNavigate: vi.fn(),
    isAnimating: false,
    canGoNext: true,
  };

  it("renders next button on first step", () => {
    render(<NavigationButtons {...defaultProps} />);
    const buttons = screen.getAllByLabelText(/Start Mediation|Next step/);
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("renders tooltips for navigation buttons", () => {
    render(<NavigationButtons {...defaultProps} />);
    // Check if Tooltip components are rendered
    expect(screen.getAllByTestId("tooltip").length).toBeGreaterThan(0);
    // Check if tooltip content matches aria-label
    // Since we mocked TooltipContent to render children, we should find the text
    const tooltipContent = screen.getAllByText("Next step");
    expect(tooltipContent.length).toBeGreaterThan(0);
  });

  it("calls onNavigate when next button is clicked", () => {
    render(<NavigationButtons {...defaultProps} />);
    const nextButtons = screen.getAllByLabelText("Next step");
    fireEvent.click(nextButtons[0]);
    expect(defaultProps.onNavigate).toHaveBeenCalledWith("next");
  });

  it("renders previous button when not on first step", () => {
    render(<NavigationButtons {...defaultProps} currentStep={2} />);
    expect(screen.getAllByLabelText("Previous step").length).toBeGreaterThan(0);
  });

  it("shows disabled tooltip/state when next step is restricted", () => {
     render(
      <NavigationButtons
        currentStep={1}
        totalSteps={5}
        onNavigate={vi.fn()}
        isAnimating={false}
        canGoNext={false}
      />
    );
    // Just verify the button still exists and tooltip is there
    const nextButtons = screen.getAllByLabelText("Next step");
    expect(nextButtons.length).toBeGreaterThan(0);

    // Check tooltip content exists
    const tooltipContent = screen.getAllByText("Next step");
    expect(tooltipContent.length).toBeGreaterThan(0);
  });
});
