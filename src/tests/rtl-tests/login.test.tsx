import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { test, expect } from 'vitest';
import { SignIn } from '@/components/auth/signIn';
import { describe } from 'node:test';

describe('SignIn', () => {
  test('user can sign in with demo login', async () => {
    const user = userEvent.setup();

    render(<SignIn />);

    const button = screen.getByRole('button', { name: /Demo Sign In/i });
    expect(button).toBeInTheDocument();

    await user.click(button);

    expect(screen.getByAltText(/loading/i)).toBeInTheDocument();
  });

  test('user will get error if they try to sign in with email and password which is not registered', async () => {
    const user = userEvent.setup();

    render(<SignIn />);

    const signInWithEmailButton = screen.getByRole('button', { name: /Sign In with Email/i });
    expect(signInWithEmailButton).toBeInTheDocument();
    await user.click(signInWithEmailButton);

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const signInButton = screen.getByRole('button', { name: /Sign In/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(signInButton).toBeInTheDocument();

    // not registered email and password
    await user.type(emailInput, 'ZZZZZZZZZZ@ZZZZZZZ.ZZZ');
    await user.type(passwordInput, 'ZZZZZZZZZ');
    await user.click(signInButton);

    await waitFor(() => {
      expect(
        screen.getByText(/There was an error signing in. Please check your credentials and try again./i),
      ).toBeInTheDocument();
    });
  });

  test('user will get error if they try to sign in with invalid email', async () => {
    const user = userEvent.setup();

    render(<SignIn />);

    const signInWithEmailButton = screen.getByRole('button', { name: /Sign In with Email/i });
    expect(signInWithEmailButton).toBeInTheDocument();
    await user.click(signInWithEmailButton);

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const signInButton = screen.getByRole('button', { name: /Sign In/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(signInButton).toBeInTheDocument();

    // invalid email address - no @ symbol
    await user.type(emailInput, 'testuser');
    await user.type(passwordInput, 'ZZZZZZZZ');
    await user.click(signInButton);

    expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
  });

  test('user can sign in with valid email and password', async () => {
    const user = userEvent.setup();

    render(<SignIn />);

    const signInWithEmailButton = screen.getByRole('button', { name: /Sign In with Email/i });
    expect(signInWithEmailButton).toBeInTheDocument();
    await user.click(signInWithEmailButton);

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const signInButton = screen.getByRole('button', { name: /Sign In/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(signInButton).toBeInTheDocument();

    await user.type(emailInput, 'testuser@testuser.com');
    await user.type(passwordInput, 'Password123');
    await user.click(signInButton);

    await waitFor(() => {
      expect(screen.getByAltText(/loading/i)).toBeInTheDocument();
    });
  });
});
