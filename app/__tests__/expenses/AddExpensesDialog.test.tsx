global.fetch = jest.fn();
jest.mock('@material-tailwind/react', () => ({
	...jest.requireActual('@material-tailwind/react'),
	Dialog: ({ children, open }: any) => (open ? <div>{children}</div> : null)
}));
import AddExpensesDialog from "@/components/dashboard/expenses/AddExpensesDialog";
import { ExpenseItemI, ExpensesTableI } from "@/interfaces/expenses";
import { processAddNewExpense } from "@/services/expenses-calculator";
import { createTestQueryClient, renderWithQuery } from "@/utils/test-utils";
import { QueryClient } from "@tanstack/react-query";
import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe('Expenses Form', () => {
	let queryClient: QueryClient;
	const mockTableData: ExpensesTableI = {
		user_id: 'test@test.com',
		_id: '507f1f77bcf86cd799439011',
		totals: {
			total_expenses: { cash: 100, card: 500 },
			total_pending: { cash: 0, card: 0 },
			total_payments_made: { cash: 0, card: 0 }
		},
		remaining: { card: 400, cash: 300 },
		income: { cash: 600, card: 1000 },
		added: [],
		expenses: [
			{ id: '1T', amount: 100, description: 'Groceries', type: 'cash', date: new Date().getTime(), isPending: false },
			{ id: '2T', amount: 500, description: 'Rent', type: 'card', date: new Date().getTime(), isPending: false },
		],
		pending: [
			{ id: 'P3', description: 'Pending test 3', amount: 500, type: 'card', fulfilled: false },
			{ id: 'P4', description: 'Pending test 4', amount: 700, type: 'card', fulfilled: false }
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

	describe('Add Pending expense', () => {
		it('calls mutation with correct data for pending expense addition', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ success: true })
			});
			const user = userEvent.setup();
			const mockHandleOpen = jest.fn();
			queryClient.setQueryData(['activeTable'], { data: mockTableData });
			renderWithQuery(<AddExpensesDialog isPending={true} isOpen={true} handleOpen={mockHandleOpen} />, queryClient);
			const descriptionInput = await screen.findByRole('textbox', { name: /description/i });
			const amountInput = screen.getByRole('spinbutton', { name: /amount/i });
			const paymehodSelect = screen.getByLabelText('Paymethod');

			await user.type(descriptionInput, 'Test pending');
			await user.type(amountInput, '100');
			await user.click(paymehodSelect);
			const option = await screen.findByRole('option', { name: /card/i });
			await user.click(option);
			const addButton = screen.getByRole('button', { name: /add/i });
			await user.click(addButton);

			await waitFor(() => {
				expect((global.fetch as jest.Mock).mock.calls.length).toBe(1);
				const newPendingExpense = { description: 'Test pending', amount: 100, originalAmount: 100, type: 'card', fulfilled: false };
				expect(global.fetch).toHaveBeenCalledWith(
					'/api/expenses/table/pending', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ currentTable_id: '507f1f77bcf86cd799439011', newPendingExpense }),
				}
				);
			});
		});
	});

	describe('Add expense', () => {
		it('calls mutation with correct data for expense addition', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ success: true })
			});
			const user = userEvent.setup();
			const mockHandleOpen = jest.fn();
			queryClient.setQueryData(['activeTable'], { data: mockTableData });
			renderWithQuery(<AddExpensesDialog isPending={false} isOpen={true} handleOpen={mockHandleOpen} />, queryClient);
			const descriptionInput = await screen.findByRole('textbox', { name: /description/i });
			const amountInput = screen.getByRole('spinbutton', { name: /amount/i });
			const paymehodSelect = screen.getByLabelText('Paymethod');

			await user.type(descriptionInput, 'Test expense');
			await user.type(amountInput, '100');
			await user.click(paymehodSelect);
			const option = await screen.findByRole('option', { name: /cash/i });
			await user.click(option);
			const addButton = screen.getByRole('button', { name: /add/i });
			await user.click(addButton);

			await waitFor(() => {
				expect((global.fetch as jest.Mock).mock.calls.length).toBe(1);
				const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
				const body = JSON.parse(options.body) as { currentTable_id: string, newClientExpense: ExpenseItemI };
				expect(url).toBe('/api/expenses/table/items');
				expect(body.newClientExpense).toMatchObject({
					description: 'Test expense',
					amount: 100,
					type: 'cash',
					date: expect.any(Number),
					isPending: false
				});

			});
		});
		it('calls mutation with correct data to add payment', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ success: true })
			});
			const user = userEvent.setup();
			const mockHandleOpen = jest.fn();
			queryClient.setQueryData(['activeTable'], { data: mockTableData });
			renderWithQuery(<AddExpensesDialog isPending={false} isOpen={true} handleOpen={mockHandleOpen} />, queryClient);
			const descriptionInput = await screen.findByRole('textbox', { name: /description/i });
			const amountInput = screen.getByRole('spinbutton', { name: /amount/i });
			const paymehodSelect = screen.getByLabelText('Paymethod');

			await user.type(descriptionInput, 'Test expense');
			await user.type(amountInput, '100');
			await user.click(paymehodSelect);
			const option = await screen.findByRole('option', { name: /card/i });
			await user.click(option);
			const checkbox = await screen.findByRole('checkbox');
			await user.click(checkbox);
			const pendingSelect = await screen.findByLabelText('Pending expense');
			await user.click(pendingSelect);
			const pendingOption = await screen.findByRole('option', { name: /pending expense id: P4/i });
			await user.click(pendingOption);

			const addButton = screen.getByRole('button', { name: /add/i });
			await user.click(addButton);

			await waitFor(() => {
				expect((global.fetch as jest.Mock).mock.calls.length).toBe(1);
				const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
				const body = JSON.parse(options.body) as { currentTable_id: string, newClientExpense: ExpenseItemI };
				expect(url).toBe('/api/expenses/table/items');
				expect(body.newClientExpense).toMatchObject({
					description: 'Test expense',
					amount: 100,
					type: 'card',
					date: expect.any(Number),
					isPending: true,
					pending_id: 'P4'
				});
			});
		});

	});

	describe('Server function', () => {
		it('should reduce pending amount when expense is linked to pending', async () => {
			const mockExpense = {
				description: 'Test expense',
				amount: 192.5,
				type: 'card',
				date: 0,
				isPending: true,
				pending_id: 'P4'
			};
			const result = await processAddNewExpense(mockExpense, mockTableData);
			expect(result.pending[1].amount).toBe(507.5);
		});
	});

	describe('Validations', () => {
		it('should display empty validation errors', async () => {
			const user = userEvent.setup();
			const mockHandleOpen = jest.fn();
			queryClient.setQueryData(['activeTable'], { data: mockTableData });
			renderWithQuery(<AddExpensesDialog isPending={false} isOpen={true} handleOpen={mockHandleOpen} />, queryClient);
			const descriptionInput = await screen.findByRole('textbox', { name: /description/i });
			const amountInput = screen.getByRole('spinbutton', { name: /amount/i });

			await user.clear(descriptionInput)
			await user.tab();
			await user.clear(amountInput);
			await user.tab();


			const addButton = screen.getByRole('button', { name: /add/i });
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
			queryClient.setQueryData(['activeTable'], { data: mockTableData });
			renderWithQuery(<AddExpensesDialog isPending={false} isOpen={true} handleOpen={mockHandleOpen} />, queryClient);
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
			expect(invalidEntries[1]).toHaveTextContent('Amount must be a positive number or zero');
			const addButton = screen.getByRole('button', { name: /add/i });
			expect(addButton).toBeDisabled();

		});

	});


});
