// ForgotPassword.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPassword from '../forgot-password/page.jsx';
import axios from 'axios';
import { enableFetchMocks } from 'jest-fetch-mock';

// Enable fetch mocks
enableFetchMocks();

jest.mock('axios');

describe('ForgotPassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the forgot password form', () => {
    render(<ForgotPassword />);
    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
  });

  test('shows a success message on successful submission', async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: 'Verification email sent successfully!' },
    });

    render(<ForgotPassword />);

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByText(/Send Verification Email/i));

    await waitFor(() => {
      expect(screen.getByText(/Verification email sent successfully!/i)).toBeInTheDocument();
    });
  });

  test('shows an error message on failed submission', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { error: 'Failed to send email' } },
    });

    render(<ForgotPassword />);

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByText(/Send Verification Email/i));

    await waitFor(() => {
      expect(screen.getByText(/Failed to send email/i)).toBeInTheDocument();
    });
  });
});
