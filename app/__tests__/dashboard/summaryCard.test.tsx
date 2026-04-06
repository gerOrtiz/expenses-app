import SummaryCard from "@/components/dashboard/cards/summaryCard";
import { ExpensesTableI } from "@/interfaces/expenses";
import { createTestQueryClient, renderWithQuery } from "@/utils/test-utils";
import { screen } from "@testing-library/react";

describe('SummaryCard', () => {
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

	it('displays summary data with correct filters', () => {
		const queryClient = createTestQueryClient();
		queryClient.setQueryData(['activeTable'], { data: mockTableData });
		renderWithQuery(<SummaryCard />, queryClient);

		const displayedData = screen.getAllByRole('paragraph');
		expect(displayedData.length).toBe(4);
		expect(displayedData[0]).toHaveTextContent('$600.00');
		expect(displayedData[1]).toHaveTextContent('37.50 % used');
		expect(displayedData[2]).toHaveTextContent('2 transactions');
		expect(displayedData[3]).toHaveTextContent('$700.00');



	});

});
