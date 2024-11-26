// VerifyEmail.test.js
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import VerifyEmail from '../verify/page.jsx';
import fetchMock from 'jest-fetch-mock';
import mockRouter from 'next-router-mock';

jest.mock('next/navigation', () => require('next-router-mock'));

describe('VerifyEmail Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.useFakeTimers();
    mockRouter.setCurrentUrl('/');
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('displays "Verifying your email..." initially', () => {
    render(<VerifyEmail />);
    expect(screen.getByText('Verifying your email...')).toBeInTheDocument();
  });

  it('displays success message and redirects on successful verification', async () => {
    const mockToken = 'validToken';
    mockRouter.setCurrentUrl(`/?token=${mockToken}`);
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 200 });

    await act(async () => render(<VerifyEmail />));

    await waitFor(() => expect(screen.getByText('Email verified successfully!')).toBeInTheDocument());
    expect(screen.getByText('Email verified successfully!')).toHaveStyle('color: green');

    act(() => jest.advanceTimersByTime(3000));
    await waitFor(() => expect(mockRouter).toMatchObject({ asPath: '/login' }));
  });

  it('displays error message on verification failure', async () => {
    const mockToken = 'invalidToken';
    mockRouter.setCurrentUrl(`/?token=${mockToken}`);
    fetchMock.mockResponseOnce('', { status: 500 });  // Force an error response

    await act(async () => render(<VerifyEmail />));

    await waitFor(() => expect(screen.getByText('An error occurred during verification.')).toBeInTheDocument());
    expect(screen.getByText('An error occurred during verification.')).toHaveStyle('color: red');
  });

  it('displays error message if no token is provided', async () => {
    mockRouter.setCurrentUrl(`/`);

    await act(async () => render(<VerifyEmail />));

    await waitFor(() => expect(screen.getByText('Verifying your email...')).toBeInTheDocument());
    expect(screen.queryByText('Email verified successfully!')).not.toBeInTheDocument();
    expect(screen.queryByText('An error occurred during verification.')).not.toBeInTheDocument();
  });
});
