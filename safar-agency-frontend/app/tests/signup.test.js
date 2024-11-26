// tests/Signup.test.jsx

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Signup from '../signup/page.jsx';
import fetchMock from 'jest-fetch-mock';
import mockRouter from 'next-router-mock';

fetchMock.enableMocks();

jest.mock('next/router', () => require('next-router-mock'));

describe('Signup Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    mockRouter.setCurrentUrl('/signup'); // Use setCurrentUrl instead of push
  });

  test('renders signup form with all input fields and submit button', async () => {
    await act(async () => render(<Signup />));

    expect(screen.getByPlaceholderText(/Enter name of your travel agency/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('shows validation error when travel agency name is too short', async () => {
    await act(async () => render(<Signup />));

    fireEvent.change(screen.getByPlaceholderText(/Enter name of your travel agency/i), { target: { value: 'ab' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Travel agency name must be at least 3 characters long/i)).toBeInTheDocument();
    });
  });

  test('shows validation error when email is invalid', async () => {
    await act(async () => render(<Signup />));

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'invalidemail' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  test('shows validation error when password is weak', async () => {
    await act(async () => render(<Signup />));

    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'weak' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      // Use a function matcher to be more flexible with how the message appears
      expect(screen.getByText((content, element) => 
        content.includes('Password must be at least 6 characters long') &&
        content.includes('include an uppercase letter, a lowercase letter, a number, and a special character')
      )).toBeInTheDocument();
    });
});


  test('shows success message when registration is successful', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'Verification email sent!' }), { status: 200 });

    await act(async () => render(<Signup />));

    fireEvent.change(screen.getByPlaceholderText(/Enter name of your travel agency/i), { target: { value: 'TravelCo' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'StrongPass1!' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => expect(screen.getByText(/Verification email sent! Please check your inbox/i)).toBeInTheDocument());
  });

  test('shows error message when server responds with an error', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'Registration failed' }), { status: 400 });

    await act(async () => render(<Signup />));

    fireEvent.change(screen.getByPlaceholderText(/Enter name of your travel agency/i), { target: { value: 'TravelCo' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'StrongPass1!' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => expect(screen.getByText(/Registration failed/i)).toBeInTheDocument());
  });

  test('shows server error message when fetch fails', async () => {
    fetchMock.mockReject(new Error('Server error'));

    await act(async () => render(<Signup />));

    fireEvent.change(screen.getByPlaceholderText(/Enter name of your travel agency/i), { target: { value: 'TravelCo' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'StrongPass1!' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => expect(screen.getByText(/Server error/i)).toBeInTheDocument());
  });
});
