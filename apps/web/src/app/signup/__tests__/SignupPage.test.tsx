import { render, screen, fireEvent } from '@testing-library/react';
import SignupPage from '../page';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('SignupPage', () => {
  it('should call the signup function on form submit', async () => {
    const signup = jest.fn();
    render(
      <AuthContext.Provider value={{ login: jest.fn(), signup, user: null, loading: false }}>
        <SignupPage />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Create an account'));

    expect(signup).toHaveBeenCalledWith('Test User', 'test@example.com', 'password');
  });
});
