import '@testing-library/jest-dom';
import 'next-router-mock/dynamic-routes';

// Enable fetch mocks for testing API calls
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();
