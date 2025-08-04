import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { test, expect, vi, beforeEach, describe } from 'vitest';
import { SignIn } from '@/components/auth/signIn';
import { signInWithEmail } from '@/db/auth/signInWithEmail';

vi.mock('@/db/auth/signInWithEmail', () => ({
  signInWithEmail: vi.fn(),
}));

const mockUserReturnValue = {
  user: { uid: 'test-uid', email: 'testuser@testuser.com' },
} as any;

describe('Sign In With Email', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('user will get error if they try to sign in with email and password which is not registered', async () => {
    const user = userEvent.setup();

    // mock the sign in with email function to return an error
    vi.mocked(signInWithEmail).mockRejectedValue(new Error('any error'));

    // render the sign in component
    render(<SignIn />);

    // click the sign in with email button
    const signInWithEmailButton = screen.getByRole('button', { name: /Sign In with Email/i });
    await user.click(signInWithEmailButton);

    // type an unregistered email and password, then click the sign-in button
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const signInButton = screen.getByRole('button', { name: /Sign In/i });
    await user.type(emailInput, 'notreigstered@email.com');
    await user.type(passwordInput, 'notregisteredpassword');
    await user.click(signInButton);

    // check sign in function was called with correct parameters
    expect(signInWithEmail).toHaveBeenCalledWith('notreigstered@email.com', 'notregisteredpassword');

    // check the error message is displayed
    await waitFor(() => {
      expect(
        screen.getByText(/There was an error signing in. Please check your credentials and try again./i),
      ).toBeInTheDocument();
    });
  });

  test('user will get error if they type a invalid email address', async () => {
    const user = userEvent.setup();

    // render the sign in component
    render(<SignIn />);

    // click the sign in with email button
    const signInWithEmailButton = screen.getByRole('button', { name: /Sign In with Email/i });
    await user.click(signInWithEmailButton);

    // type an invalid email and password, then click the sign-in button
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const signInButton = screen.getByRole('button', { name: /Sign In/i });
    await user.type(emailInput, 'this-is-not-a-valid-email');
    await user.type(passwordInput, 'password123');
    await user.click(signInButton);

    // check the invalid email error message is displayed
    expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
  });

  test('user can sign in with valid email and password', async () => {
    const user = userEvent.setup();

    // mock the sign in with email function
    vi.mocked(signInWithEmail).mockResolvedValue(mockUserReturnValue);

    // render the sign in component
    render(<SignIn />);

    // click the sign in with email button
    const signInWithEmailButton = screen.getByRole('button', { name: /Sign In with Email/i });
    expect(signInWithEmailButton).toBeInTheDocument();
    await user.click(signInWithEmailButton);

    // type valid email and password, then click the sign-in button
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const signInButton = screen.getByRole('button', { name: /Sign In/i });
    await user.type(emailInput, 'testuser@testuser.com');
    await user.type(passwordInput, 'Password123');
    await user.click(signInButton);

    // check sign in function was called with correct parameters
    expect(signInWithEmail).toHaveBeenCalledWith('testuser@testuser.com', 'Password123');
    expect(signInWithEmail).toHaveBeenCalledTimes(1);
  });
});
