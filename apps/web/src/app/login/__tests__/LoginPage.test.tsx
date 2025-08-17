import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../page';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('LoginPage', () => {
  it('should call the login function on form submit', async () => {
    const login = jest.fn();
    render(
      <AuthContext.Provider value={{ login, signup: jest.fn(), user: null, loading: false }}>
        <LoginPage />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Login'));

    expect(login).toHaveBeenCalledWith('test@example.com', 'password');
  });
});
