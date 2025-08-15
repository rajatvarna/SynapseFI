import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Cookies from 'js-cookie';
import { Navbar } from './Navbar';

// Mock js-cookie
vi.mock('js-cookie', async (importOriginal) => {
  const actual = await importOriginal<typeof Cookies>();
  return {
    ...actual,
    default: {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
    },
  };
});

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockedCookies = vi.mocked(Cookies);

describe('Navbar', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when user is not authenticated', () => {
    it('renders Login and Sign Up links', () => {
      mockedCookies.get.mockReturnValue(undefined);
      render(<Navbar />);

      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
      expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockedCookies.get.mockReturnValue('fake-token');
    });

    it('renders Dashboard, Profile, and Logout links', async () => {
      render(<Navbar />);

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
      expect(screen.queryByText('Login')).not.toBeInTheDocument();
    });

    it('calls Cookies.remove on logout', async () => {
      render(<Navbar />);

      await waitFor(() => {
        expect(screen.getByText('Logout')).toBeInTheDocument();
      });

      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      expect(mockedCookies.remove).toHaveBeenCalledWith('token');
    });
  });
});
