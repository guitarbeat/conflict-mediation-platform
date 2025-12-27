import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("./assets/logo.png", () => ({ default: "/logo.png" }));

const mockToast = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: mockToast,
}));

vi.mock("./components/ui/sonner", () => ({
  Toaster: () => null,
}));

vi.mock("@vercel/analytics/react", () => ({
  Analytics: () => null,
}));

// Mock Tooltip component to avoid Radix issues in tests
vi.mock("./components/ui/tooltip", () => ({
  Tooltip: ({ children }) => <div>{children}</div>,
  TooltipContent: ({ children }) => <div>{children}</div>,
  TooltipTrigger: ({ children }) => <div>{children}</div>,
  TooltipProvider: ({ children }) => <div>{children}</div>,
}));

import App from "./App.jsx";

describe("App", () => {
  beforeEach(() => {
    mockToast.success.mockReset();
    mockToast.error.mockReset();
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the app heading", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /Co-op Conflict Resolution Platform/i })
    ).toBeInTheDocument();
  });

  it("shows the resume banner when saved data exists", async () => {
    const savedFormData = {
      partyAName: "Alice",
      partyBName: "Bob",
    };

    // Directly mock localStorage instead of spyOn prototype to ensure it works with standard APIs
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
        if (key === "mediation_form_v1") {
            return JSON.stringify(savedFormData);
        }
        return null;
    });

    render(<App />);

    expect(
      await screen.findByText(
        /Resumed a previously saved session from this device\./i
      )
    ).toBeInTheDocument();

    const resetButtons = screen.getAllByRole("button", { name: /reset/i });
    expect(resetButtons.length).toBeGreaterThan(0);
    const resetButton = resetButtons[0];
    expect(resetButton).toBeVisible();
    expect(resetButton).toBeEnabled();

    getItemSpy.mockRestore();
  });

  it("resets the saved session when clicking the resume banner reset button", async () => {
    const savedFormData = {
      partyAName: "Alice",
      partyBName: "Bob",
    };

    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
        if (key === "mediation_form_v1") {
            return JSON.stringify(savedFormData);
        }
        return null;
    });

    const removeItemSpy = vi
      .spyOn(Storage.prototype, "removeItem")
      .mockImplementation(() => {});

    render(<App />);

    await screen.findByText(
      /Resumed a previously saved session from this device\./i
    );

    const resetButtons = screen.getAllByRole("button", { name: /reset/i });
    expect(resetButtons.length).toBeGreaterThan(0);
    const resetButton = resetButtons[0];
    fireEvent.click(resetButton);

    // Use waitFor to handle potential async nature of the click handler (even though it looks sync)
    // The previous failure might be due to the state update loop or async error handler wrapper
    await vi.waitFor(() => {
        expect(removeItemSpy).toHaveBeenCalledWith("mediation_form_v1");
        expect(mockToast.success).toHaveBeenCalledWith(
        "Form data reset successfully"
        );
    });

    getItemSpy.mockRestore();
  });

  it("blocks navigation when required fields are missing", () => {
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);

    render(<App />);

    expect(screen.getAllByText(/Personalize each party/i).length).toBeGreaterThan(
      0
    );

    const nextButtons = screen.getAllByRole("button", { name: /next step/i });
    expect(nextButtons.length).toBeGreaterThan(0);
    const nextButton = nextButtons[0];
    fireEvent.click(nextButton);

    expect(mockToast.error).toHaveBeenCalledWith(
      "Complete the required fields before continuing: Party A Name, Party B Name, Conflict Description"
    );
    expect(screen.getAllByText(/Personalize each party/i).length).toBeGreaterThan(
      0
    );
  });
});
