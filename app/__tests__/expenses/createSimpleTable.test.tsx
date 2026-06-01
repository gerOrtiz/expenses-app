global.fetch = jest.fn();

jest.mock('@material-tailwind/react', () => ({
	...jest.requireActual('@material-tailwind/react'),
	Dialog: ({ children, open }: any) => (open ? <div>{children}</div> : null)
}));

import CreateSimpleTableComponent from "@/components/simpleTable/createSimpleTableComponent";
import { ExpensesTableI } from "@/interfaces/expenses";
import { processStartNewPeriod } from "@/services/expenses-calculator";
import { createTestQueryClient, renderWithQuery } from "@/utils/test-utils";
import { QueryClient } from "@tanstack/react-query";
import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockTableData: ExpensesTableI = {
	user_id: 'test@test.com',
	_id: '507f1f77bcf86cd799439011',
	totals: {
		total_expenses: { cash: 100, card: 800 },
		total_pending: { cash: 900, card: 1000 },
		total_payments_made: { cash: 0, card: 300 }
	},
	remaining: { card: 1900, cash: 500 },
	income: { cash: 600, card: 3000 },
	added: [],
	expenses: [
		{ id: '1T', amount: 100, description: 'Groceries', type: 'cash', date: new Date().getTime(), isPending: false },
		{ id: '2T', amount: 500, description: 'Rent', type: 'card', date: new Date().getTime(), isPending: false },
		{ id: '3T', amount: 100, description: 'Pending test 1', type: 'card', date: new Date().getTime(), isPending: true, pending_id: 'P3' },
		{ id: '5T', amount: 200, description: 'Pending test 2', type: 'card', date: new Date().getTime(), isPending: true, pending_id: 'P4' },
	],
	pending: [
		{ id: 'P3', description: 'Pending test 3', originalAmount: 600, amount: 500, type: 'card', fulfilled: false },
		{ id: 'P4', description: 'Pending test 4', originalAmount: 700, amount: 500, type: 'card', fulfilled: false },
		{ id: 'P6', description: 'Pending test 6', originalAmount: 900, amount: 900, type: 'cash', fulfilled: false }
	],
	sDate: new Date().getTime(),
	fDate: 0,
	status: 'active'
};
describe('CreateSimpleTableComponent', () => {
	let queryClient: QueryClient;
	beforeEach(() => {
		queryClient = createTestQueryClient();
		// Reset fetch mock before each test
		(global.fetch as jest.Mock).mockClear();
	});

	afterEach(() => {
		queryClient.clear();
		cleanup();
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
			const errors = await screen.findAllByRole('alert');
			expect(errors.length).toBe(2);
			const minError = errors[0];
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

		it('shows an error when none of the inputs is positive', async () => {
			const user = userEvent.setup();
			renderWithQuery(<CreateSimpleTableComponent />, queryClient);
			// Open the dialog
			const openButton = screen.getByRole('button', { name: /create new expenses table/i });
			await user.click(openButton);
			const cardInput = screen.getAllByRole('spinbutton', { name: /amount/i })[1];

			await user.click(cardInput);
			await user.tab();
			const error = await screen.findByRole('alert');
			expect(error).toBeInTheDocument();
			expect(error).toHaveTextContent('At least one method must be positive');
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

	describe('Mutation behavior', () => {
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

	});

	describe('Server function', () => {
		it('creates a new pending array based off of last closed table', async () => {
			const mockSession = { expires: '0', user: { id: '1', email: 'test@mail.com' } };
			const newTable = await processStartNewPeriod(mockTableData, mockSession, { card: 1000, cash: 200 });
			expect(newTable.totals.total_pending.card).toBe(1300);
		});
	});

});
