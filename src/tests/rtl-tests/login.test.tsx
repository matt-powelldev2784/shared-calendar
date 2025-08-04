import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { test, expect } from 'vitest';
import { SignIn } from '@/components/auth/signIn';
import { describe } from 'node:test';

describe('SignIn Component', () => {
  test('user can sign in with demo login', async () => {
    const user = userEvent.setup();

    render(<SignIn />);

    const button = screen.getByRole('button', { name: /Demo Sign In/i });
    expect(button).toBeInTheDocument();

    await user.click(button);

    expect(screen.getByAltText(/loading/i)).toBeInTheDocument();
  });
});
