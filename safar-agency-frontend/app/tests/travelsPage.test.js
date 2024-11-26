// Import necessary libraries and components
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axios from 'axios';
import TravelDetailsForm from '../traveldetails/page.jsx'; // Update with the correct path

// Mock the axios module
jest.mock('axios');

describe('TravelDetailsForm', () => {
    const mockToken = "fakeToken.eyJ1c2VySWQiOiJBbnkifQ.fakeSignature"; // Mocked JWT token

    beforeEach(() => {
        // Mock the API response
        axios.get.mockResolvedValue({
            data: {
                name: "Test Travel Agency",
                email: "test@travel.com",
                contactNo: "1234567890",
                city: "Test City",
                state: "Test State",
                address: "123 Test Address",
                country: "Test Country",
                pincode: "123456",
                // Add other necessary fields based on your API response structure
            },
        });
    });

    test('makes an API call to fetch data on mount and sets form to edit mode', async () => {
        // Render the TravelDetailsForm component
        const { getByLabelText } = render(<TravelDetailsForm token={mockToken} />); // Ensure you pass the token if required

        // Wait for the API call to complete and check if the data is populated in the form
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/travel/Any", {
                headers: { Authorization: `Bearer ${mockToken}` },
            });
        });

        // Assertions to check if form fields are populated with the fetched data
        expect(getByLabelText(/Name:/i).value).toBe("Test Travel Agency");
        expect(getByLabelText(/Email:/i).value).toBe("test@travel.com");
        expect(getByLabelText(/Contact No:/i).value).toBe("1234567890");
        expect(getByLabelText(/City:/i).value).toBe("Test City");
        expect(getByLabelText(/State:/i).value).toBe("Test State");
        expect(getByLabelText(/Address:/i).value).toContain("123 Test Address");
        expect(getByLabelText(/Country:/i).value).toBe("Test Country");
        expect(getByLabelText(/Pincode:/i).value).toBe("123456");
    });
});
