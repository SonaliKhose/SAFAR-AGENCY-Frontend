// ResetPasswordPage.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResetPasswordPage from '../reset-password/page.jsx';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

// Mocking the useRouter and useSearchParams from Next.js
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({
    get: jest.fn().mockReturnValue('mockToken'), // Mock token retrieval
  })),
}));

jest.mock('axios');

describe('ResetPasswordPage Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockPush });
  });

  test('renders the reset password form', () => {
    render(<ResetPasswordPage />);
    expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your new password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Confirm your new password/i)).toBeInTheDocument();
  });

  test('shows error if passwords do not match', async () => {
    render(<ResetPasswordPage />);
    
    fireEvent.change(screen.getByPlaceholderText(/Enter your new password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your new password/i), {
      target: { value: 'differentPassword' },
    });
    fireEvent.click(screen.getByText(/Reset Password/i));

    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test('shows success message and redirects after successful password reset', async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: 'Password reset successful!' },
    });

    render(<ResetPasswordPage />);

    fireEvent.change(screen.getByPlaceholderText(/Enter your new password/i), {
      target: { value: 'newPassword123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your new password/i), {
      target: { value: 'newPassword123' },
    });
    fireEvent.click(screen.getByText(/Reset Password/i));

    await waitFor(() => {
      expect(screen.getByText(/Password reset successful!/i)).toBeInTheDocument();
    });

    // Wait for redirection to occur
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  test('shows error message on failed password reset', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'Failed to reset password' } },
    });

    render(<ResetPasswordPage />);

    fireEvent.change(screen.getByPlaceholderText(/Enter your new password/i), {
      target: { value: 'newPassword123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your new password/i), {
      target: { value: 'newPassword123' },
    });
    fireEvent.click(screen.getByText(/Reset Password/i));

    await waitFor(() => {
      expect(screen.getByText(/Failed to reset password/i)).toBeInTheDocument();
    });
  });
});
