import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./assets/logo.png", () => ({ default: "/logo.png" }));

import App from "./App.jsx";

describe("App", () => {
  it("renders the app heading", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /Co-op Conflict Resolution Platform/i })
    ).toBeInTheDocument();
  });
});