import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Dashboard from "../dashboard/page.jsx";
import { useRouter } from "next/navigation";
import "@testing-library/jest-dom";

// Mocking useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Dashboard Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  test("redirects to /login if authToken is missing", () => {
    render(<Dashboard />);
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  test("renders header and sections when authToken is present", () => {
    sessionStorage.setItem("authToken", "testToken");
    render(<Dashboard />);
    
    expect(screen.getByText("Welcome to SAFAR")).toBeInTheDocument();
    expect(screen.getByText("Your adventure starts with us!")).toBeInTheDocument();
    expect(screen.getByText("Our Services")).toBeInTheDocument();
    expect(screen.getByText("Explore Popular Destinations")).toBeInTheDocument();
    expect(screen.getByText("What Our Clients Say")).toBeInTheDocument();
  });

  test("displays services section with correct information", () => {
    sessionStorage.setItem("authToken", "testToken");
    render(<Dashboard />);
    
    expect(screen.getByText("Flight Booking")).toBeInTheDocument();
    expect(screen.getByText("Hotel Reservations")).toBeInTheDocument();
    expect(screen.getByText("Travel Insurance")).toBeInTheDocument();
  });

  test("displays destinations with images and titles", async () => {
    sessionStorage.setItem("authToken", "testToken");
    render(<Dashboard />);
    
    const destinationNames = ["Paris", "New York", "Tokyo"];
    for (const name of destinationNames) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }

    const destinationImages = screen.getAllByRole("img");
    expect(destinationImages.length).toBe(3);
    expect(destinationImages[0]).toHaveAttribute("alt", "Paris");
    expect(destinationImages[1]).toHaveAttribute("alt", "New York");
    expect(destinationImages[2]).toHaveAttribute("alt", "Tokyo");
  });

  test("displays testimonials section with client feedback", () => {
    sessionStorage.setItem("authToken", "testToken");
    render(<Dashboard />);
    
    expect(screen.getByText(/My trip was flawless thanks to Safar/i)).toBeInTheDocument();
    expect(screen.getByText(/The booking process was simple/i)).toBeInTheDocument();
  });

  test("login and signup buttons are visible in call-to-action section", () => {
    sessionStorage.setItem("authToken", "testToken");
    render(<Dashboard />);
    
    expect(screen.getByRole("link", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Sign Up/i })).toBeInTheDocument();
  });

  
});
