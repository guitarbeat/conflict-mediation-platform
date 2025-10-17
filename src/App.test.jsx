import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./assets/logo.png", () => ({ default: "/logo.png" }));

import App from "./App.jsx";

describe("App", () => {
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
    const savedFormData = {
      partyAName: "Alice",
      partyBName: "Bob",
    };

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

    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(
      JSON.stringify(savedFormData)
    );

    render(<App />);

    expect(
      screen.getByText(
        /Resumed a previously saved session from this device\./i
      )
    ).toBeInTheDocument();

    const resetButton = screen.getByRole("button", { name: /reset/i });
    expect(resetButton).toBeVisible();
    expect(resetButton).toBeEnabled();
  });
});