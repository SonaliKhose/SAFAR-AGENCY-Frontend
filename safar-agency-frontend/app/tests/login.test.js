// components/Login.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../login/page.jsx';
import { useAuth } from '../context/userContext';
import { useRouter } from 'next/navigation';

jest.mock('../context/userContext');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Login Component', () => {
  let loginMock, pushMock;

  beforeEach(() => {
    loginMock = jest.fn();
    pushMock = jest.fn();
    useAuth.mockReturnValue({ login: loginMock });
    useRouter.mockReturnValue({ push: pushMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the login form with email and password fields', () => {
    render(<Login />);

    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  // test('shows an error message for invalid email format', async () => {
  //   render(<Login />);
    
  //   fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
  //     target: { value: 'invalid-email' }, // intentionally invalid format
  //   });
  //   fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
  //     target: { value: 'password123' },
  //   });
  //   fireEvent.click(screen.getByRole('button', { name: /log in/i }));
  
  //   // Wrap in waitFor to ensure DOM updates
  //   await waitFor(() => {
  //     expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
  //   });
  // });
  

  test('shows an error message for short password', async () => {
    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: '123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters long/i)).toBeInTheDocument();
    });
  });

  test('calls the login function and redirects on successful API response', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'test-token' }),
      })
    );

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('test-token');
      expect(pushMock).toHaveBeenCalledWith('/');
    });
  });

  test('shows server error message on failed API response', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid credentials' }),
      })
    );

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('shows a general server error message if the fetch call fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Server error')));

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });
  });
});
