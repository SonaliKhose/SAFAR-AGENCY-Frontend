import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CarsPage from "../cardetails/page"; // Update path if needed
import axios from "axios";
import MockDate from "mockdate";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";

// Mock router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mock axios
jest.mock("axios");

describe("CarsPage", () => {
  beforeEach(() => {
    MockDate.set("2024-10-29");
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress errors for cleaner test output

    // Set up a simple authToken in sessionStorage without encoding
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn((key) => key === 'authToken' ? "mockAuthToken" : null),
        setItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true
    });

    // Mock router
    useRouter.mockImplementation(() => ({
      push: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    MockDate.reset();
  });

  it("fetches and displays cars", async () => {
    const carsData = [
      { _id: "1", carName: "Car 1", carType: "SUV", price: "100", pricePerKm: "10" },
      { _id: "2", carName: "Car 2", carType: "Sedan", price: "200", pricePerKm: "20" },
    ];
    axios.get.mockResolvedValueOnce({ data: carsData });

    render(
      <>
        <CarsPage />
        <ToastContainer />
      </>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Car 1")).toBeInTheDocument();
      expect(screen.getByText("Car 2")).toBeInTheDocument();
    });
  });

  it("shows error message on fetch failure", async () => {
    axios.get.mockRejectedValueOnce(new Error("Error fetching cars"));

    render(
      <>
        <CarsPage />
        <ToastContainer />
      </>
    );

    await waitFor(() => {
      expect(screen.getByText(/error fetching cars/i)).toBeInTheDocument();
    });
  });

  it("handles form submission for creating a new car", async () => {
    const carData = {
      _id: "3",
      carName: "Car 3",
      carType: "Hatchback",
      price: "150",
      pricePerKm: "15"
    };
    axios.post.mockResolvedValueOnce({ data: carData });

    render(
      <>
        <CarsPage />
        <ToastContainer />
      </>
    );

    fireEvent.click(screen.getByText(/add car/i));

    fireEvent.change(screen.getByLabelText(/car name/i), { target: { value: "Car 3" } });
    fireEvent.change(screen.getByLabelText(/car type/i), { target: { value: "Hatchback" } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: "150" } });
    fireEvent.change(screen.getByLabelText(/price per km/i), { target: { value: "15" } });

    const file = new File(["dummy content"], "image.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText(/image/i), { target: { files: [file] } });

    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => {
      expect(screen.getByText("Car added successfully!")).toBeInTheDocument();
    });

    expect(screen.getByText("Car 3")).toBeInTheDocument();
  });

  it("handles form submission errors", async () => {
    axios.post.mockRejectedValueOnce(new Error("Error creating car"));

    render(
      <>
        <CarsPage />
        <ToastContainer />
      </>
    );

    fireEvent.click(screen.getByText(/add car/i));

    fireEvent.change(screen.getByLabelText(/car name/i), { target: { value: "Car 3" } });
    fireEvent.change(screen.getByLabelText(/car type/i), { target: { value: "Hatchback" } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: "150" } });
    fireEvent.change(screen.getByLabelText(/price per km/i), { target: { value: "15" } });

    const file = new File(["dummy content"], "image.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText(/image/i), { target: { files: [file] } });

    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => {
      expect(screen.getByText("Error creating car!")).toBeInTheDocument();
    });
  });

  it("deletes a car", async () => {
    const carsData = [
      { _id: "1", carName: "Car 1", carType: "SUV", price: "100", pricePerKm: "10" },
    ];

    axios.get.mockResolvedValueOnce({ data: carsData });
    axios.delete.mockResolvedValueOnce({});

    render(
      <>
        <CarsPage />
        <ToastContainer />
      </>
    );

    await waitFor(() => {
      expect(screen.getByText("Car 1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/delete/i));

    await waitFor(() => {
      expect(screen.getByText("Car deleted successfully!")).toBeInTheDocument();
    });

    expect(screen.queryByText("Car 1")).not.toBeInTheDocument();
  });
});
