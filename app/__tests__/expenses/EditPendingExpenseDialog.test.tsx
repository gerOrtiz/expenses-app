global.fetch = jest.fn();
jest.mock('../../../hooks/useActiveExpenses');
jest.mock('@material-tailwind/react', () => ({
	...jest.requireActual('@material-tailwind/react'),
	Dialog: ({ children, open }: any) => (open ? <div>{children}</div> : null)
}));

import { EditPendingExpenseDialog } from "@/components/dashboard/expenses/EditPendingExpenseDialog";
import { useActiveExpenses } from "@/hooks/useActiveExpenses";
import { ExpensesTableI, PendingExpenseI } from "@/interfaces/expenses";
import { processFulfillPendingExpense } from "@/services/expenses-calculator";
import { createTestQueryClient, renderWithQuery } from "@/utils/test-utils";
import { QueryClient } from "@tanstack/react-query";
import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockUseActiveExpenses = useActiveExpenses as jest.MockedFunction<typeof useActiveExpenses>;

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
describe('Edit Pending Expense', () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		mockUseActiveExpenses.mockReturnValue(mockTableData.expenses);
		queryClient = createTestQueryClient();
		(global.fetch as jest.Mock).mockClear();
	});

	afterEach(() => {
		queryClient.clear();
		cleanup();
	});

	describe('Simple Edition Fetch', () => {
		it('call mutation with correct data to update pending expense description', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ success: true })
			});
			const user = userEvent.setup();
			const mockHandleOpen = jest.fn();
			renderWithQuery(<EditPendingExpenseDialog isOpen={true} pending={mockTableData.pending[0]} handleOpen={mockHandleOpen} />, queryClient);
			const descriptionInput = await screen.findByRole('textbox', { name: /description/i });

			await user.clear(descriptionInput);
			await user.type(descriptionInput, 'Test Pending');
			const saveButton = screen.getByRole('button', { name: /save/i });
			await user.click(saveButton);

			await waitFor(() => {
				expect((global.fetch as jest.Mock).mock.calls.length).toBe(1);
				const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
				const body = JSON.parse(options.body) as { pendingExpense: PendingExpenseI }
				expect(url).toBe('/api/expenses/table/pending');

				expect(body.pendingExpense).toMatchObject({
					id: 'P3',
					description: 'Test Pending',
					originalAmount: 600,
					amount: 500,
					type: 'card',
					fulfilled: false
				});
			});
		});

		it('call mutation with correct data to update pending expense', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ success: true })
			});
			const user = userEvent.setup();
			const mockHandleOpen = jest.fn();

			renderWithQuery(<EditPendingExpenseDialog isOpen={true} pending={mockTableData.pending[2]} handleOpen={mockHandleOpen} />, queryClient);

			const descriptionInput = await screen.findByRole('textbox', { name: /description/i });
			const amountInput = screen.getByRole('spinbutton', { name: /amount/i });
			const paymehodSelect = await screen.findByLabelText('Paymethod');
			const saveButton = screen.getByRole('button', { name: /save/i });

			await user.clear(descriptionInput);
			await user.type(descriptionInput, 'Test Pending');
			await user.clear(amountInput);
			await user.type(amountInput, '500');
			await user.click(paymehodSelect);
			const option = await screen.findByRole('option', { name: /card/i });
			await user.click(option);
			await user.click(saveButton);

			await waitFor(() => {
				expect((global.fetch as jest.Mock).mock.calls.length).toBe(1);
				const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
				const body = JSON.parse(options.body) as { pendingExpense: PendingExpenseI }
				expect(url).toBe('/api/expenses/table/pending');
				//expect(body.currentTable_id).toBe('507f1f77bcf86cd799439011');
				expect(body.pendingExpense).toMatchObject({
					id: 'P6',
					description: 'Test Pending',
					originalAmount: 500,
					amount: 500,
					type: 'card',
					fulfilled: false
				});
			});
		});

	});

	describe('Fulfill Pending', () => {
		it('calls mutation with correct data to mark pending as fulfilled', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ success: true })
			});
			const user = userEvent.setup();
			const mockHandleOpen = jest.fn();

			renderWithQuery(<EditPendingExpenseDialog isOpen={true} pending={mockTableData.pending[1]} handleOpen={mockHandleOpen} />, queryClient);
			const fulfillTabButton = await screen.findByRole('tab', { name: /fulfill/i });
			expect(fulfillTabButton).toBeInTheDocument();
			await user.click(fulfillTabButton);
			const fulfillButton = await screen.findByRole('button', { name: /fulfill/i });
			await user.click(fulfillButton);

			await waitFor(() => {
				expect((global.fetch as jest.Mock).mock.calls.length).toBe(1);
				expect(global.fetch).toHaveBeenCalledWith(
					'/api/expenses/table/pending?id=P4', {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
				}
				);
			});

		});

	});

	describe('Server functions', () => {
		it('should return fulfilled pending and updated totals', async () => {
			const result = await processFulfillPendingExpense('P4', mockTableData);
			expect(result.pending[1].amount).toBe(0);
			expect(result.pending[1].fulfilled).toBe(true);
			expect(result.totals.total_pending.card).toBe(500);
			expect(result.totals.total_payments_made.card).toBe(300);

		});
	});

	describe('Validations', () => {
		it('should have amount input and select type disabled', async () => {
			const mockHandleOpen = jest.fn();
			renderWithQuery(<EditPendingExpenseDialog isOpen={true} pending={mockTableData.pending[0]} handleOpen={mockHandleOpen} />, queryClient);

			const descriptionInput = await screen.findByRole('textbox', { name: /description/i });
			const amountInput = screen.getByRole('spinbutton', { name: /amount/i });
			const paymehodSelect = await screen.findByLabelText('Paymethod');
			expect(descriptionInput).toBeEnabled();
			expect(amountInput).toBeDisabled();
			expect(paymehodSelect).toBeDisabled();
		});

		it('should display empty validation errors', async () => {
			const user = userEvent.setup();
			const mockHandleOpen = jest.fn();
			renderWithQuery(<EditPendingExpenseDialog isOpen={true} pending={mockTableData.pending[2]} handleOpen={mockHandleOpen} />, queryClient);
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
			renderWithQuery(<EditPendingExpenseDialog isOpen={true} pending={mockTableData.pending[2]} handleOpen={mockHandleOpen} />, queryClient);

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
			const addButton = screen.getByRole('button', { name: /save/i });
			expect(addButton).toBeDisabled();

		});

	});
});
