jest.mock('next/navigation');
jest.mock('next-auth/react');
import LoginForm from '@/components/login/loginForm';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event';

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;

describe('Login Form', () => {
	const mockRouterInstance = {
		push: jest.fn(),
		replace: jest.fn(),
		refresh: jest.fn(),
		back: jest.fn(),
		forward: jest.fn(),
		prefetch: jest.fn(),
	};

	beforeEach(() => {
		mockUseRouter.mockReturnValue(mockRouterInstance);
		mockSignIn.mockResolvedValue({ ok: true, error: null } as any);
		render(<LoginForm />);

	});

	afterEach(() => {
		cleanup();
		jest.clearAllMocks();
	});

	it('should displayed an enabled button', () => {
		const button = screen.getByRole('button', { name: /sign in/i });
		expect(button).toBeEnabled();
	});

	it('should show email validation errors on blur', async () => {
		const user = userEvent.setup();
		const emailInput = screen.getByRole('textbox', { name: /email/i });
		await user.type(emailInput, 'john_doe');
		await user.tab();
		const alert = await screen.findByRole('alert');
		expect(alert).toBeInTheDocument();
		expect(alert).toHaveTextContent('The format for email is invalid');
	});

	it('should show password validation error when password is empty', async () => {
		const user = userEvent.setup();
		const emailInput = screen.getByLabelText(/email/i);
		const submitButton = screen.getByRole('button', { name: /sign in/i });
		await user.type(emailInput, 'test@example.com');
		await user.click(submitButton);
		expect(await screen.findByRole('alert')).toHaveTextContent(/password is required/i);
	});

	it('does not call signIn when form is invalid', async () => {
		const user = userEvent.setup();
		const submitButton = screen.getByRole('button', { name: /sign in/i });
		await user.click(submitButton);
		expect(mockSignIn).not.toHaveBeenCalled();
	});

	it('should disable button on submitting', async () => {
		const user = userEvent.setup();
		const emailInput = screen.getByLabelText(/email/i);
		const passwordInput = screen.getByLabelText('Password');
		const submitButton = screen.getByRole('button', { name: /sign in/i });
		await user.type(emailInput, 'test@example.com');
		await user.type(passwordInput, 'password123');
		await user.click(submitButton);
		expect(signIn).toHaveBeenCalled();
		waitFor(() => {
			expect(submitButton).toBeDisabled();
		}, { timeout: 3000 });
	});

});
