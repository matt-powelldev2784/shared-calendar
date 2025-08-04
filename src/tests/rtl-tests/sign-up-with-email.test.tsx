import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { test, expect, vi, beforeEach, describe } from 'vitest';
import { SignIn } from '@/components/auth/signIn';
import { signUpWithEmail } from '@/db/auth/signInWithEmail';

vi.mock('@/db/auth/signInWithEmail', () => ({
  signUpWithEmail: vi.fn(),
}));

const mockUserReturnValue = {
  user: { uid: 'test-uid', email: 'testuser@testuser.com' },
} as any;

describe('Sign Up With Email', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('user can create account with valid email and password', async () => {
    const user = userEvent.setup();

    // mock the sign up with email function
    vi.mocked(signUpWithEmail).mockResolvedValue(mockUserReturnValue);

    // render the sign in component
    render(<SignIn />);

    // click the create account link
    const createAccountLink = screen.getByText(/Create one/i);
    await user.click(createAccountLink);

    // type valid email and passwords, then click the create account button
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/^Password$/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/Confirm password/i);
    const createAccountButton = screen.getByRole('button', { name: /Create Account/i });
    await user.type(emailInput, 'newuser@email.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(createAccountButton);

    // check sign up function was called with correct parameters
    expect(signUpWithEmail).toHaveBeenCalledWith('newuser@email.com', 'password123');
    expect(signUpWithEmail).toHaveBeenCalledTimes(1);
  });

  test('user will get error if they try to create account with email that already exists', async () => {
    const user = userEvent.setup();

    // mock the sign up with email function to return email-already-in-use error
    vi.mocked(signUpWithEmail).mockRejectedValue({ code: 'auth/email-already-in-use' });

    // render the sign in component
    render(<SignIn />);

    // click the create account link
    const createAccountLink = screen.getByText(/Create one/i);
    await user.click(createAccountLink);

    // type email that already exists and passwords, then click the create account button
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/^Password$/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/Confirm password/i);
    const createAccountButton = screen.getByRole('button', { name: /Create Account/i });

    await user.type(emailInput, 'existing@email.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(createAccountButton);

    // check sign up function was called with correct parameters
    expect(signUpWithEmail).toHaveBeenCalledWith('existing@email.com', 'password123');

    // check the email already exists error message is displayed
    await waitFor(() => {
      expect(
        screen.getByText(/An account with this email already exists. Please sign in instead./i),
      ).toBeInTheDocument();
    });
  });

  test('user will get generic error message if a unknown errors is returned when create a account ', async () => {
    const user = userEvent.setup();

    // mock the sign up with email function to return unknown error
    vi.mocked(signUpWithEmail).mockRejectedValue({ code: 'any-other-error-message' });

    // render the sign in component
    render(<SignIn />);

    // click the create account link
    const createAccountLink = screen.getByText(/Create one/i);
    await user.click(createAccountLink);

    // type email and passwords, then click the create account button
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/^Password$/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/Confirm password/i);
    const createAccountButton = screen.getByRole('button', { name: /Create Account/i });
    await user.type(emailInput, 'user@email.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(createAccountButton);

    // check sign up function was called with correct parameters
    expect(signUpWithEmail).toHaveBeenCalledWith('user@email.com', 'password123');

    // check the unknown error message is displayed
    await waitFor(() => {
      expect(
        screen.getByText(/There was an error when creating the account. Please try again later./i),
      ).toBeInTheDocument();
    });
  });

  test('user will get error if the passwords do not match', async () => {
    const user = userEvent.setup();

    // render the sign in component
    render(<SignIn />);

    // click the create account link
    const createAccountLink = screen.getByText(/Create one/i);
    await user.click(createAccountLink);

    // type email and mismatched passwords, then click the create account button
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/^Password$/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/Confirm password/i);
    const createAccountButton = screen.getByRole('button', { name: /Create Account/i });

    await user.type(emailInput, 'user@email.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'this-password-does-not-match');
    await user.click(createAccountButton);

    // check the passwords don't match error message is displayed
    expect(screen.getByText(/Passwords don't match/i)).toBeInTheDocument();
  });

  test('user will get error if password is too short', async () => {
    const user = userEvent.setup();

    // render the sign in component
    render(<SignIn />);

    // click the create account link
    const createAccountLink = screen.getByText(/Create one/i);
    await user.click(createAccountLink);

    // wait for state to update and the input elements to be available
    // type email and short password, then click the create account button
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/^Password$/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/Confirm password/i);
    const createAccountButton = screen.getByRole('button', { name: /Create Account/i });
    await user.type(emailInput, 'user@email.com');
    await user.type(passwordInput, '1234567');
    await user.type(confirmPasswordInput, '123'); // shorter than 6 characters
    await user.click(createAccountButton);

    // check the password too short error message is displayed
    expect(screen.getByText(/Password must be at least 6 characters long/i)).toBeInTheDocument();
  });

  test('user will get error if they type a invalid email address', async () => {
    const user = userEvent.setup();

    // render the sign in component
    render(<SignIn />);

    // click the create account link
    const createAccountLink = screen.getByText(/Create one/i);
    await user.click(createAccountLink);

    // type invalid email and passwords, then click the create account button
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/^Password$/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/Confirm password/i);
    const createAccountButton = screen.getByRole('button', { name: /Create Account/i });

    await user.type(emailInput, 'this-is-not-a-valid-email');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(createAccountButton);

    // check the invalid email error message is displayed
    expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
  });
});
