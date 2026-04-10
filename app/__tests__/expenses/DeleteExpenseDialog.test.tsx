global.fetch = jest.fn();
// jest.mock('../../../hooks/useActiveTableId');
jest.mock('@material-tailwind/react', () => ({
	...jest.requireActual('@material-tailwind/react'),
	Dialog: ({ children, open }: any) => (open ? <div>{children}</div> : null)
}));

import DeleteExpenseDialog from "@/components/dashboard/expenses/DeleteExpenseDialog";
import { ExpensesTableI } from "@/interfaces/expenses";
import { processDeleteExpenses, processDeletePendingExpense } from "@/services/expenses-calculator";
import { createTestQueryClient, renderWithQuery } from "@/utils/test-utils";
import { QueryClient } from "@tanstack/react-query";
import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockTableData: ExpensesTableI = {
	user_id: 'test@test.com',
	_id: '507f1f77bcf86cd799439011',
	totals: {
		total_expenses: { cash: 100, card: 800 },
		total_pending: { cash: 0, card: 1000 },
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
		{ id: 'P4', description: 'Pending test 4', originalAmount: 700, amount: 500, type: 'card', fulfilled: false }
	],
	sDate: new Date().getTime(),
	fDate: 0,
	status: 'active'
};

describe('Delete Dialog', () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = createTestQueryClient();
		(global.fetch as jest.Mock).mockClear();
		// mockUseActiveTableId.mockReturnValue('507f1f77bcf86cd799439011');
	});

	afterEach(() => {
		queryClient.clear();
		cleanup();
	});

	describe('Expenses deletion', () => {
		it('calls mutation with correct data to delete an specific expense', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ success: true })
			});
			const user = userEvent.setup();
			const mockHandleCancel = jest.fn();
			renderWithQuery(<DeleteExpenseDialog expense={mockTableData.expenses[0]} onCancel={mockHandleCancel} />, queryClient);
			const deleteButton = await screen.findByRole('button', { name: /delete/i });
			await user.click(deleteButton);

			await waitFor(() => {
				expect((global.fetch as jest.Mock).mock.calls.length).toBe(1);
				expect(global.fetch).toHaveBeenCalledWith(
					'/api/expenses/table/items?id=1T', {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
				}
				);
			});
		});

		it('displays correct warning message', async () => {
			const mockHandleCancel = jest.fn();
			renderWithQuery(<DeleteExpenseDialog expense={mockTableData.expenses[0]} date={mockTableData.expenses[0].date} onCancel={mockHandleCancel} />, queryClient);
			const alert = await screen.findByRole('alert');
			expect(alert).toHaveTextContent(`This action can't be undone.`);
		});

		it('should return updated table data after expense deletion', async () => {
			const result = await processDeleteExpenses('3T', mockTableData);
			expect(result.expenses.length).toBe(3);
			expect(result.pending[0].amount).toBe(600);
			expect(result.totals.total_pending.card).toBe(1100);
			expect(result.totals.total_payments_made.card).toBe(200);
		});

	});

	describe('Pending expenses deletion', () => {
		it('calls mutation with correct data to delete an specific pending expense', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ success: true })
			});
			const user = userEvent.setup();
			const mockHandleCancel = jest.fn();
			renderWithQuery(<DeleteExpenseDialog expense={mockTableData.pending[0]} isPending={true} onCancel={mockHandleCancel} />, queryClient);
			const deleteButton = await screen.findByRole('button', { name: /delete/i });
			await user.click(deleteButton);

			await waitFor(() => {
				expect((global.fetch as jest.Mock).mock.calls.length).toBe(1);
				expect(global.fetch).toHaveBeenCalledWith(
					'/api/expenses/table/pending?id=P3', {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
				}
				);
			});
		});
		it('displays correct warning message', async () => {
			const mockHandleCancel = jest.fn();
			renderWithQuery(<DeleteExpenseDialog expense={mockTableData.pending[0]} isPending={true} onCancel={mockHandleCancel} />, queryClient);
			const alert = await screen.findByRole('alert');
			expect(alert).toHaveTextContent(`If there are linked payments to this pending expense, it will affect totals and reports. This action can't be undone.`);
		});

		it('should return updated table data after pending deletion', async () => {
			const result = await processDeletePendingExpense('P3', mockTableData);
			console.log(result);
			expect(result.pending.length).toBe(1);
			expect(result.expenses[2].isPending).toBe(false);
			expect(result.totals.total_pending.card).toBe(500);
			expect(result.totals.total_payments_made.card).toBe(200);
		});

	});


});
