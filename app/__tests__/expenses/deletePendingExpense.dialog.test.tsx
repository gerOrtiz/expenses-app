import { ExpensesTableI } from "@/interfaces/expenses";
import { processDeletePendingExpense } from "@/services/expenses-calculator";

describe('Delete Pending Expense', () => {
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
	it('should return updated table data', async () => {
		const result = await processDeletePendingExpense('P3', mockTableData);
		expect(result.pending.length).toBe(1);
		expect(result.expenses[2].isPending).toBe(false);
		expect(result.totals.total_pending.card).toBe(500);
		expect(result.totals.total_payments_made.card).toBe(200);
	});

});
