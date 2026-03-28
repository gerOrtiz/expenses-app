jest.mock('next/navigation');
jest.mock('next-auth/react');
jest.mock('../../../lib/user/actions');
import SignUpForm from "@/components/login/signUpForm";
import { signUpUser } from "@/lib/user/actions";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockSignUpUser = signUpUser as jest.MockedFunction<typeof signUpUser>;
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;

describe('Signup form', () => {
	const mockRouterInstance = {
		push: jest.fn(),
		replace: jest.fn(),
		refresh: jest.fn(),
		back: jest.fn(),
		forward: jest.fn(),
		prefetch: jest.fn(),
	};

	beforeEach(() => {
		render(<SignUpForm />);
		mockUseRouter.mockReturnValue(mockRouterInstance);
		mockSignUpUser.mockResolvedValue({
			message: '',
			user: { email: 'test@mail.com', password: 'password123' }
		} as any);
		mockSignIn.mockResolvedValue({ ok: true, error: null } as any);
	});

	afterEach(() => {
		cleanup();
		jest.clearAllMocks();
	});

	test('should display a disabled button', () => {
		const signUpButton = screen.getByRole('button', { name: /sign up/i });
		expect(signUpButton).toBeDisabled();
	});

	test('should display required error for name input on blur', async () => {
		const user = userEvent.setup();
		const nameInput = screen.getByRole('textbox', { name: /name/i });
		await user.click(nameInput);
		await user.tab();
		const alert = await screen.findByRole('alert');
		expect(alert).toBeInTheDocument();
		expect(alert).toHaveTextContent(/name is required/i);
	});

	test('should display character length error for name input on blur', async () => {
		const user = userEvent.setup();
		const nameInput = screen.getByRole('textbox', { name: /name/i });
		await user.type(nameInput, 'aa');
		await user.tab();
		const alert = await screen.findByRole('alert');
		expect(alert).toBeInTheDocument();
		expect(alert).toHaveTextContent(/name must have at least 3 characters/i);
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

	it('should show password needing a capital letter validation error when missing one', async () => {
		const user = userEvent.setup();
		const passwordInput = screen.getByLabelText('Password');
		await user.type(passwordInput, 'password123');
		await user.tab();
		const alert = await screen.findByRole('alert');
		expect(alert).toBeInTheDocument();
		expect(alert).toHaveTextContent('Password must contain at least one capital letter');
	});

	it('should show password needing a number validation error when missing a number', async () => {
		const user = userEvent.setup();
		const passwordInput = screen.getByLabelText('Password');
		await user.type(passwordInput, 'Password');
		await user.tab();
		const alert = await screen.findByRole('alert');
		expect(alert).toBeInTheDocument();
		expect(alert).toHaveTextContent('Password must contain at least one number');
	});


	it('should show password min length error when short password was typed', async () => {
		const user = userEvent.setup();
		const passwordInput = screen.getByLabelText('Password');
		await user.type(passwordInput, 'Pass');
		await user.tab();
		const alert = await screen.findByRole('alert');
		expect(alert).toBeInTheDocument();
		expect(alert).toHaveTextContent('Password must be at least 7 characters long');
	});

	it('should show password required validation error on blur', async () => {
		const user = userEvent.setup();
		const passwordInput = screen.getByLabelText('Password');
		await user.click(passwordInput);
		await user.tab();
		const alert = await screen.findByRole('alert');
		expect(alert).toBeInTheDocument();
		expect(alert).toHaveTextContent('Password is required');
	});

	it('should show a missmatch error validation when password do not match', async () => {
		const user = userEvent.setup();
		const passwordInput = screen.getByLabelText('Password');
		const confirmPassword = screen.getByLabelText('Confirm password');
		await user.type(passwordInput, 'Password123');
		await user.type(confirmPassword, 'Pass');
		await user.tab();
		const alert = await screen.findByRole('alert');
		expect(alert).toBeInTheDocument();
		expect(alert).toHaveTextContent('Passwords must be the same');
	});

	it('should disable signup button after submitting form', async () => {
		const user = userEvent.setup();
		const nameInput = screen.getByRole('textbox', { name: /name/i });
		const emailInput = screen.getByRole('textbox', { name: /email/i });
		const passwordInput = screen.getByLabelText('Password');
		const confirmPassword = screen.getByLabelText('Confirm password');
		await user.type(nameInput, 'John');
		await user.type(emailInput, 'john_doe@mail.com');
		await user.type(passwordInput, 'Password123');
		await user.type(confirmPassword, 'Password123');
		const signUpButton = screen.getByRole('button', { name: /sign up/i });
		expect(signUpButton).toBeEnabled();
		await user.click(signUpButton);
		expect(signUpUser).toHaveBeenCalled();
		waitFor(() => {
			expect(signUpButton).toBeDisabled();
		}, { timeout: 3000 });

	});

});
