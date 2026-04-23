jest.mock('next-auth/react');
import LoginLayout from '@/components/login/loginLayout';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signIn } from 'next-auth/react';

const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;

jest.mock('../../../components/login/loginForm', () => {
	return function MockLoginForm() {
		return <div data-testid="login-form">Login</div>;
	};
});

jest.mock('../../../components/login/signUpForm', () => {
	return function MockSignUpForm() {
		return <div data-testid="signup-form">Sign up</div>;
	};
});


describe('Login Layout', () => {

	beforeEach(() => {
		mockSignIn.mockResolvedValue({ ok: true, error: null } as any);
		render(<LoginLayout />);
	});

	afterEach(() => {
		cleanup();
		jest.clearAllMocks();
	});

	it('should call signIn after Google button is clicked', async () => {
		const user = userEvent.setup();
		const googleButton = screen.getByRole('button', { name: /Continue with Google/i });
		expect(googleButton).toBeInTheDocument();
		await user.click(googleButton);
		expect(mockSignIn).toHaveBeenCalled();
	});

	it('should change views when clicking change view button', async () => {
		const user = userEvent.setup();
		const title = screen.getByRole('heading', { level: 2 });
		const headerTitle = screen.getByRole('heading', { level: 3 });
		const paragraphs = screen.getAllByRole('paragraph');

		expect(title).toHaveTextContent('Sign in');
		expect(headerTitle).toHaveTextContent('Login');
		expect(screen.getByTestId('login-form')).toBeInTheDocument();
		expect(paragraphs[0]).toHaveTextContent(`Don't have an account?`);
		const signupButton = screen.queryByRole('button', { name: /Sign up here/i });
		expect(signupButton).toBeInTheDocument();
		await user.click(signupButton);
		expect(title).toHaveTextContent('Create an account');
		expect(headerTitle).toHaveTextContent('Sign up');
		expect(screen.getByTestId('signup-form')).toBeInTheDocument();
		expect(paragraphs[0]).toHaveTextContent(`Already have an account?`);
		const loginButton = screen.queryByRole('button', { name: /Login here/i });
		expect(loginButton).toBeInTheDocument();
	});

});
