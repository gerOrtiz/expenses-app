import DashboardCharts from "@/components/dashboard/cards/DashboardCharts";
import { ExpensesTableI } from "@/interfaces/expenses";
import { render, screen } from "@testing-library/react";

describe('Dashboard Charts', () => {
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
		pending: [],
		sDate: new Date().getTime(),
		fDate: 0,
		status: 'active'
	};

	it('displays correct data for charts', () => {
		render(<DashboardCharts data={mockTableData} />);
		const headings = screen.getAllByRole('heading', { level: 5 });
		expect(headings.length).toBe(3);
	});
});
