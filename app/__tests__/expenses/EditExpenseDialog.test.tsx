global.fetch = jest.fn();
jest.mock('@material-tailwind/react', () => ({
	...jest.requireActual('@material-tailwind/react'),
	Dialog: ({ children, open }: any) => (open ? <div>{children}</div> : null)
}));
import EditExpenseDialog from "@/components/simpleTable/expenses/EditExpenseDialog";
import { ExpenseItemI, ExpensesTableI } from "@/interfaces/expenses";
import { processUpdateExpenses } from "@/services/expenses-calculator";
import { createTestQueryClient, renderWithQuery } from "@/utils/test-utils";
import { QueryClient } from "@tanstack/react-query";
import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";



describe('Edit expenses form', () => {
	let queryClient: QueryClient;
	const mockExpense: ExpenseItemI = { id: '1T', amount: 100, description: 'Groceries', type: 'cash', date: new Date().getTime(), isPending: false };
	const mockTableData: ExpensesTableI = {
		user_id: 'test@test.com',
		_id: '507f1f77bcf86cd799439011',
		totals: {
			total_expenses: { cash: 100, card: 800 },
			total_pending: { cash: 900, card: 1100 },
			total_payments_made: { cash: 0, card: 200 }
		},
		remaining: { card: 1900, cash: 500 },
		income: { cash: 600, card: 3000 },
		added: [],
		expenses: [
			{ id: '1T', amount: 100, description: 'Groceries', type: 'cash', date: new Date().getTime(), isPending: false },
			{ id: '2T', amount: 500, description: 'Rent', type: 'card', date: new Date().getTime(), isPending: false },
			{ id: '3T', amount: 100, description: 'Pending test 1', type: 'card', date: new Date().getTime(), isPending: false },
			{ id: '5T', amount: 200, description: 'Pending test 2', type: 'card', date: new Date().getTime(), isPending: true, pending_id: 'P4' },

		],
		pending: [
			{ id: 'P3', description: 'Pending test 3', originalAmount: 600, amount: 600, type: 'card', fulfilled: false },
			{ id: 'P4', description: 'Pending test 4', originalAmount: 700, amount: 500, type: 'card', fulfilled: false },
			{ id: 'P6', description: 'Pending test 6', originalAmount: 900, amount: 900, type: 'cash', fulfilled: false }
		],
		sDate: new Date().getTime(),
		fDate: 0,
		status: 'active'
	};

	beforeEach(() => {
		queryClient = createTestQueryClient();
		(global.fetch as jest.Mock).mockClear();

	});

	afterEach(() => {
		queryClient.clear();
		cleanup();
	});

	describe('Fetch call', () => {
		it('call mutation with correct data to update expense description and amount', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ success: true })
			});
			const user = userEvent.setup();
			const mockHandleOpen = jest.fn();
			queryClient.setQueryData(['activeTable'], { data: mockTableData });
			renderWithQuery(<EditExpenseDialog isOpen={true} expense={mockExpense} handleOpen={mockHandleOpen} />, queryClient);

			const descriptionInput = await screen.findByRole('textbox', { name: /description/i });
			const amountInput = screen.getByRole('spinbutton', { name: /amount/i });

			await user.clear(descriptionInput);
			await user.type(descriptionInput, 'Test groceries');
			await user.clear(amountInput);
			await user.type(amountInput, '56');
			const saveButton = screen.getByRole('button', { name: /save/i });
			await user.click(saveButton);

			await waitFor(() => {
				expect((global.fetch as jest.Mock).mock.calls.length).toBe(1);
				const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
				const body = JSON.parse(options.body) as { clientExpense: ExpenseItemI }
				expect(url).toBe('/api/expenses/table/items');
				//expect(body.currentTable_id).toBe('507f1f77bcf86cd799439011');
				expect(body.clientExpense).toMatchObject({
					id: '1T',
					description: 'Test groceries',
					amount: 56,
					type: 'cash',
					date: expect.any(Number),
					isPending: false
				});
			});

		});

		it('call mutation with correct data to update expense method', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ success: true })
			});
			const user = userEvent.setup();
			const mockHandleOpen = jest.fn();
			queryClient.setQueryData(['activeTable'], { data: mockTableData });
			renderWithQuery(<EditExpenseDialog isOpen={true} expense={mockExpense} handleOpen={mockHandleOpen} />, queryClient);
			const paymehodSelect = await screen.findByLabelText('Method');

			await user.click(paymehodSelect);
			const option = await screen.findByRole('option', { name: /card/i });
			await user.click(option);
			const saveButton = screen.getByRole('button', { name: /save/i });
			await user.click(saveButton);

			await waitFor(() => {
				expect((global.fetch as jest.Mock).mock.calls.length).toBe(1);
				const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
				const body = JSON.parse(options.body) as { clientExpense: ExpenseItemI }
				expect(url).toBe('/api/expenses/table/items');
				// expect(body.currentTable_id).toBe('507f1f77bcf86cd799439011');
				expect(body.clientExpense).toMatchObject({
					id: '1T',
					description: 'Groceries',
					amount: 100,
					type: 'card',
					date: expect.any(Number),
					isPending: false
				});
			});
		});

		it('call mutation with correct data to update expense pending link', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ success: true })
			});
			const user = userEvent.setup();
			const mockHandleOpen = jest.fn();
			queryClient.setQueryData(['activeTable'], { data: mockTableData });
			renderWithQuery(<EditExpenseDialog isOpen={true} expense={mockExpense} handleOpen={mockHandleOpen} />, queryClient);
			const checkbox = await screen.findByRole('checkbox');
			await user.click(checkbox);
			expect(checkbox).toBeChecked();

			const saveButton = await screen.findByRole('button', { name: /save/i });
			await user.click(saveButton);

			await waitFor(() => {
				expect((global.fetch as jest.Mock).mock.calls.length).toBe(1);
				const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
				const body = JSON.parse(options.body) as { clientExpense: ExpenseItemI }
				expect(url).toBe('/api/expenses/table/items');
				expect(body.clientExpense).toMatchObject({
					id: '1T',
					description: 'Groceries',
					amount: 100,
					type: 'cash',
					date: expect.any(Number),
					isPending: true,
					pending_id: 'P6'
				});
			});
		});

	});

	describe('Validations', () => {
		it('should display empty validation errors', async () => {
			const user = userEvent.setup();
			const mockHandleOpen = jest.fn();
			renderWithQuery(<EditExpenseDialog isOpen={true} expense={mockExpense} handleOpen={mockHandleOpen} />, queryClient);

			const descriptionInput = await screen.findByRole('textbox', { name: /description/i });
			const amountInput = screen.getByRole('spinbutton', { name: /amount/i });

			await user.clear(descriptionInput)
			await user.tab();
			await user.clear(amountInput);
			await user.tab();


			const addButton = screen.getByRole('button', { name: /save/i });
			expect(addButton).toBeDisabled();
			const emptyAlerts = await screen.findAllByRole('alert');
			expect(emptyAlerts.length).toBe(2);
			for (let index = 0; index < emptyAlerts.length; index++) {
				const element = emptyAlerts[index];
				expect(element).toHaveTextContent('This field is required');
			}
		});

		it('should display wrong entries validations', async () => {
			const user = userEvent.setup();
			const mockHandleOpen = jest.fn();
			renderWithQuery(<EditExpenseDialog isOpen={true} expense={mockExpense} handleOpen={mockHandleOpen} />, queryClient);

			const descriptionInput = await screen.findByRole('textbox', { name: /description/i });
			const amountInput = screen.getByRole('spinbutton', { name: /amount/i });
			await user.clear(descriptionInput);
			await user.type(descriptionInput, 'A');
			await user.clear(amountInput);
			await user.type(amountInput, '-1');
			await user.tab();

			const invalidEntries = await screen.findAllByRole('alert');
			expect(invalidEntries.length).toBe(2);
			expect(invalidEntries[0]).toHaveTextContent('Description requires at least 3 characters');
			expect(invalidEntries[1]).toHaveTextContent('Amount must be a positive number');
			const addButton = screen.getByRole('button', { name: /save/i });
			expect(addButton).toBeDisabled();

		});

	});

	describe('Server function', () => {
		it('should return updated totals when pendingId is added', async () => {
			const mockUpdated = { id: '3T', amount: 100, description: 'Pending test 1', type: 'card', date: new Date().getTime(), isPending: true, pending_id: 'P3' };
			const result = await processUpdateExpenses(mockUpdated, mockTableData);

			expect(result.totals.total_expenses.card).toBe(800);
			expect(result.totals.total_pending.card).toBe(1000);
			expect(result.totals.total_payments_made.card).toBe(300);
			expect(result.pending[0].amount).toBe(500);
			expect(result.expenses[2].amount).toBe(100);

		});

		it('should return updated totals when pendingId is added', async () => {
			const mockUpdated = { id: '5T', amount: 200, description: 'Pending test 2', type: 'card', date: new Date().getTime(), isPending: false };
			const result = await processUpdateExpenses(mockUpdated, mockTableData);

			expect(result.totals.total_expenses.card).toBe(800);
			expect(result.totals.total_pending.card).toBe(1300);
			expect(result.totals.total_payments_made.card).toBe(100);
			expect(result.pending[1].amount).toBe(700);
			expect(result.expenses[3].amount).toBe(200);

		});

	});

});
