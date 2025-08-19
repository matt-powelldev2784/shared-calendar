import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { test, expect, vi, beforeEach, describe } from 'vitest';
import { SignIn } from '@/components/auth/signIn';
import { signInWithEmailForDemo } from '@/db/auth/signInWithEmail';

vi.mock('@/db/auth/signInWithEmail', () => ({
  signInWithEmailForDemo: vi.fn(),
}));

const mockUserReturnValue = {
  user: { uid: 'test-uid', email: 'testuser@testuser.com' },
} as any;

describe('Sign In With As Demo Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('user can sign in with demo login', async () => {
    const user = userEvent.setup();

    // mock the sign in with email for demo function
    vi.mocked(signInWithEmailForDemo).mockResolvedValue(mockUserReturnValue);

    // render the sign in component
    render(<SignIn />);

    // click the demo sign in button
    const button = screen.getByRole('button', { name: /Demo Sign In/i });
    expect(button).toBeInTheDocument();
    await user.click(button);

    // check the demo sign in function was called
    expect(signInWithEmailForDemo).toHaveBeenCalledTimes(1);
  });
});
