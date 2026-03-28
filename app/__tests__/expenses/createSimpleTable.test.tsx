global.fetch = jest.fn();

jest.mock('@material-tailwind/react', () => ({
	...jest.requireActual('@material-tailwind/react'),
	Dialog: ({ children, open }: any) => (open ? <div>{children}</div> : null)
}));

import CreateSimpleTableComponent from "@/components/dashboard/tables/createSimpleTableComponent";
import { createTestQueryClient, renderWithQuery } from "@/utils/test-utils";
import { QueryClient } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe('CreateSimpleTableComponent', () => {
	let queryClient: QueryClient;
	beforeEach(() => {
		queryClient = createTestQueryClient();
		// Reset fetch mock before each test
		(global.fetch as jest.Mock).mockClear();
	});

	afterEach(() => {
		queryClient.clear();
	});

	describe('validation errors', () => {
		it('shows cash input validation errors', async () => {
			const user = userEvent.setup();
			renderWithQuery(<CreateSimpleTableComponent />, queryClient);
			// Open the dialog
			const openButton = screen.getByRole('button', { name: /create new expenses table/i });
			await user.click(openButton);
			const cashInput = screen.getAllByRole('spinbutton', { name: /amount/i })[0];

			await user.clear(cashInput);
			await user.tab();
			const requiredError = await screen.findByRole('alert');
			expect(requiredError).toBeInTheDocument();
			expect(requiredError).toHaveTextContent('This field is required');

			await user.type(cashInput, '-1');
			const minError = await screen.findByRole('alert');
			expect(minError).toBeInTheDocument();
			expect(minError).toHaveTextContent('Amount must be a positive number or zero');
		});
		it('shows card input validation errors', async () => {
			const user = userEvent.setup();
			renderWithQuery(<CreateSimpleTableComponent />, queryClient);
			// Open the dialog
			const openButton = screen.getByRole('button', { name: /create new expenses table/i });
			await user.click(openButton);
			const cardInput = screen.getAllByRole('spinbutton', { name: /amount/i })[1];

			await user.clear(cardInput);
			await user.tab();
			const requiredError = await screen.findByRole('alert');
			expect(requiredError).toBeInTheDocument();
			expect(requiredError).toHaveTextContent('This field is required');

			await user.type(cardInput, '-1');
			const minError = await screen.findByRole('alert');
			expect(minError).toBeInTheDocument();
			expect(minError).toHaveTextContent('Amount must be a positive number or zero');
		});

		it('disables submission button when invalid', async () => {
			const user = userEvent.setup();
			renderWithQuery(<CreateSimpleTableComponent />, queryClient);
			// Open the dialog
			const openButton = screen.getByRole('button', { name: /create new expenses table/i });
			await user.click(openButton);
			const cardInput = screen.getAllByRole('spinbutton', { name: /amount/i })[1];
			await user.clear(cardInput);
			await user.tab();
			expect(screen.getByRole('button', { name: /Create table/i })).toBeDisabled();

		});

	});



	it('calls mutation with correct data when form is submitted', async () => {
		// Mock successful response
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => ({ success: true }),
		});

		renderWithQuery(<CreateSimpleTableComponent />, queryClient);
		const user = userEvent.setup();
		// Open the dialog
		const openButton = screen.getByRole('button', { name: /create new expenses table/i });
		await user.click(openButton);

		// Fill form
		const cashInput = screen.getAllByRole('spinbutton', { name: /amount/i })[0];
		const cardInput = screen.getAllByRole('spinbutton', { name: /amount/i })[1];

		await user.clear(cashInput);
		await user.type(cashInput, '100');
		await user.clear(cardInput);
		await user.type(cardInput, '200');

		// Submit form
		const submitButton = screen.getByRole('button', { name: /create table/i });
		await user.click(submitButton);

		// Verify fetch was called correctly
		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledWith(
				'/api/expenses/table',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ cash: 100, card: 200 }),
				}
			);
		});
	});

	it('invalidates activeTable query after successful mutation', async () => {
		// Mock successful response
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => ({ success: true }),
		});

		// Set initial query data
		queryClient.setQueryData(['activeTable'], { data: null });

		renderWithQuery(<CreateSimpleTableComponent />, queryClient);
		const user = userEvent.setup();
		// Open dialog and fill form
		await user.click(screen.getByRole('button', { name: /create new expenses table/i }));

		const cashInput = screen.getAllByRole('spinbutton', { name: /amount/i })[0];
		const cardInput = screen.getAllByRole('spinbutton', { name: /amount/i })[1];

		await user.clear(cashInput);
		await user.type(cashInput, '100');
		await user.clear(cardInput);
		await user.type(cardInput, '200');

		// Submit
		await user.click(screen.getByRole('button', { name: /create table/i }));

		// Verify query was invalidated
		await waitFor(() => {
			const queryState = queryClient.getQueryState(['activeTable']);
			// After invalidation, query is marked as stale
			expect(queryState?.isInvalidated).toBe(true);
		});
	});

	it('resets form after successful submission', async () => {
		// Mock successful response
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => ({ success: true }),
		});

		renderWithQuery(<CreateSimpleTableComponent />, queryClient);
		const user = userEvent.setup();
		// Open dialog
		await user.click(screen.getByRole('button', { name: /create new expenses table/i }));

		const cashInput = screen.getAllByRole('spinbutton', { name: /amount/i })[0] as HTMLInputElement;
		const cardInput = screen.getAllByRole('spinbutton', { name: /amount/i })[1] as HTMLInputElement;

		// Fill form
		await user.clear(cashInput);
		await user.type(cashInput, '100');
		await user.clear(cardInput);
		await user.type(cardInput, '200');

		// Verify values are filled
		expect(cashInput.value).toBe('100');
		expect(cardInput.value).toBe('200');

		// Submit form
		await user.click(screen.getByRole('button', { name: /create table/i }));

		// Wait for mutation to complete and form to reset
		await waitFor(() => {
			expect(cashInput.value).toBe('0'); // Reset to default value
			expect(cardInput.value).toBe('0');
		});
	});
});
