import { AddedIncomeI, ExpensesTableI, PendingExpenseI } from "@/interfaces/expenses";
import { processAddIncome, processAddPending } from "@/services/expenses-calculator";

describe('Expenses Calculator', () => {
	const mockTableData: ExpensesTableI = {
		user_id: 'test@test.com',
		_id: '507f1f77bcf86cd799439011',
		totals: {
			total_expenses: { cash: 100, card: 500 },
			total_pending: { cash: 0, card: 1200 },
			total_payments_made: { cash: 0, card: 0 }
		},
		remaining: { card: 500, cash: 500 },
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

	describe('Process Add Income', () => {
		it('adds simple income, return updated added array and remaining correctly', async () => {
			const newIncome: AddedIncomeI = { date: new Date().getTime(), isWithdrawal: false, card: 0, cash: 200 };
			const res = await processAddIncome(newIncome, mockTableData);
			expect(res.added.length).toBe(1);
			expect(res.added[0].cash).toBe(200);
			expect(res.remaining.card).toBe(500);//remaining card should stay the same
			expect(res.remaining.cash).toBe(700);
		});
		it('withdraw a given amount, return updated added array and remaining updated properly', async () => {
			const newIncome: AddedIncomeI = { date: new Date().getTime(), isWithdrawal: true, card: 0, cash: 150 };
			const res = await processAddIncome(newIncome, mockTableData);
			expect(res.added.length).toBe(1);
			// Withdrawal transfers from card to cash (ATM logic: electronic → physical money)
			expect(res.remaining.card).toBe(350); //remaining card should have changed
			expect(res.remaining.cash).toBe(650);
		});
	});

	describe('Process Add Pending', () => {
		it('adds new card pending expense', async () => {
			const newClientPendingExpense: PendingExpenseI = { description: 'Mock pending', type: 'card', amount: 350 };
			const res = await processAddPending(newClientPendingExpense, mockTableData);
			expect(res.pending.length).toBe(3);
			expect(res.pending[2].type).toBe('card');
			expect(res.pending[2].amount).toBe(350);
			expect(res.totals.total_pending.card).toBe(1550);
			expect(res.totals.total_pending.cash).toBe(0);
		});
		it('adds new cash pending expense', async () => {
			const newClientPendingExpense: PendingExpenseI = { description: 'Mock pending cash', type: 'cash', amount: 400 };
			const res = await processAddPending(newClientPendingExpense, mockTableData);
			expect(res.pending.length).toBe(3);
			expect(res.pending[2].type).toBe('cash');
			expect(res.pending[2].amount).toBe(400);
			expect(res.totals.total_pending.card).toBe(1200);
			expect(res.totals.total_pending.cash).toBe(400);
		});
	});

});
