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

// Setup matchMedia mock
window.matchMedia = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// Mock useFormData to control its return values directly in tests
// This avoids complex mocking of localStorage and internal hook state
const mockUseFormData = {
  formData: {
    partyAName: "",
    partyBName: "",
  },
  updateFormData: vi.fn(),
  updateMultipleFields: vi.fn(),
  loadedFromStorage: false,
  resetFormData: vi.fn(),
  getRequiredFieldsForStep: vi.fn().mockReturnValue([]),
  isStepComplete: vi.fn().mockReturnValue(true),
  getMissingFieldsForStep: vi.fn().mockReturnValue([]),
  getRequiredFieldsForSubStep: vi.fn().mockReturnValue([]),
};

vi.mock("./hooks/useFormData", () => ({
  useFormData: () => mockUseFormData,
}));

import App from "./App.jsx";

describe("App", () => {
  beforeEach(() => {
    mockToast.success.mockReset();
    mockToast.error.mockReset();
    mockUseFormData.loadedFromStorage = false;
    mockUseFormData.resetFormData.mockReset();
    mockUseFormData.isStepComplete.mockReturnValue(true);
    mockUseFormData.getMissingFieldsForStep.mockReturnValue([]);
    mockUseFormData.getRequiredFieldsForStep.mockReturnValue([]);

    // Reset matchMedia mock for each test
    window.matchMedia.mockClear();
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

  it("shows the resume banner when saved data exists", () => {
    mockUseFormData.loadedFromStorage = true;

    render(<App />);

    expect(
      screen.getByText(
        /Resumed a previously saved session from this device\./i
      )
    ).toBeInTheDocument();

    const resetButtons = screen.getAllByRole("button", { name: /reset/i });
    expect(resetButtons.length).toBeGreaterThan(0);
  });

  it("resets the saved session when clicking the resume banner reset button", () => {
    mockUseFormData.loadedFromStorage = true;

    render(<App />);

    const resetButtons = screen.getAllByRole("button", { name: /reset/i });
    const resetButton = resetButtons[0];
    fireEvent.click(resetButton);

    expect(mockUseFormData.resetFormData).toHaveBeenCalled();
  });

  it("blocks navigation when required fields are missing", () => {
    mockUseFormData.isStepComplete.mockReturnValue(false);
    mockUseFormData.getMissingFieldsForStep.mockReturnValue(["partyAName", "partyBName", "conflictDescription"]);
    mockUseFormData.getRequiredFieldsForStep.mockReturnValue(["partyAName", "partyBName", "conflictDescription"]);

    render(<App />);

    const nextButtons = screen.getAllByRole("button", { name: /next step/i });
    const nextButton = nextButtons[0];
    fireEvent.click(nextButton);

    expect(mockToast.error).toHaveBeenCalledWith(
      "Complete the required fields before continuing: Party A Name, Party B Name, Conflict Description"
    );
  });
});
