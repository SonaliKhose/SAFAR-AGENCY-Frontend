import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // for extended matchers
import Navbar from '../navbar/page'; // Adjust the path as necessary
import { useAuth } from '../context/userContext';

// Mock useAuth context
jest.mock('../context/userContext', () => ({
  useAuth: jest.fn(),
}));

describe('Navbar Component', () => {
  it('renders Login and Signup buttons when user is not authenticated', () => {
    useAuth.mockReturnValue({ username: null, logout: jest.fn() });

    render(<Navbar />);
    
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  it('renders the username and profile dropdown when user is authenticated', () => {
    useAuth.mockReturnValue({ username: 'TestUser', logout: jest.fn() });

    render(<Navbar />);
    
    expect(screen.getByText(/Welcome, TestUser!/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Welcome, TestUser!/i));
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  it('logs out the user when Logout is clicked', () => {
    const mockLogout = jest.fn();
    useAuth.mockReturnValue({ username: 'TestUser', logout: mockLogout });

    render(<Navbar />);
    
    fireEvent.click(screen.getByText(/Welcome, TestUser!/i));
    fireEvent.click(screen.getByText(/Logout/i));
    
    expect(mockLogout).toHaveBeenCalled();
  });

  it('navigates to the profile page when Profile is clicked', () => {
    useAuth.mockReturnValue({ username: 'TestUser', logout: jest.fn() });
    
    render(<Navbar />);
    
    fireEvent.click(screen.getByText(/Welcome, TestUser!/i));
    fireEvent.click(screen.getByText(/Profile/i));

    expect(screen.queryByText(/Profile/i)).not.toBeInTheDocument(); // Dropdown should close after click
  });
});
