import SimpleTableLayoutComponent from "@/components/dashboard/layout/simpleTableLayout";
import { ExpensesTableI } from "@/interfaces/expenses";
import { createTestQueryClient, renderWithQuery } from "@/utils/test-utils";
import { screen } from "@testing-library/react";

jest.mock('../../../components/dashboard/tables/CloseActiveTableButton', () => {
	return function MockCloseTableButton() {
		return <button >Close</button>;
	};
});
jest.mock('../../../components/dashboard/tables/expensesTableWrapper', () => {
	return function MockSimpleTableWrapper() {
		return <div data-testid="table-wrapper">Table wrapper</div>;
	};
});
jest.mock('../../../components/dashboard/tables/createSimpleTableComponent', () => {
	return function MockCreateSimpleTableComponent() {
		return <div data-testid="new-table">Create new table</div>;
	};
});
jest.mock('../../../components/loadingSkeletons/expensesPageSkeleton', () => {
	return function MockExpensesPageSkeleton() {
		return <div data-testid="expenses-skeleton">Skeleton</div>;
	};
});



describe('SimpleTableLayout', () => {
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
			{ id: '1', amount: 100, description: 'Groceries', type: 'cash', date: new Date().getTime(), isPending: false },
			{ id: '2', amount: 500, description: 'Rent', type: 'card', date: new Date().getTime(), isPending: false },
		],
		pending: [],
		sDate: new Date().getTime(),
		fDate: 0,
		status: 'active'
	};

	describe('Loading State', () => {
		it('displays loading skeleton', () => {
			const queryClient = createTestQueryClient();
			renderWithQuery(<SimpleTableLayoutComponent />, queryClient);
			expect(screen.getByTestId('expenses-skeleton')).toBeInTheDocument();
		});
	});

	describe('Success State with Data', () => {
		it('shows navigation button, close button and table wrapper ', () => {
			const queryClient = createTestQueryClient();
			queryClient.setQueryData(['activeTable'], { data: mockTableData });
			renderWithQuery(<SimpleTableLayoutComponent />, queryClient);
			expect(screen.getByRole('link', { name: /Return to your dashboard/i })).toBeInTheDocument();
			expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Daily expenses');
			expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
			expect(screen.getByTestId('table-wrapper')).toBeInTheDocument();
			expect(screen.queryByTestId('new-table')).not.toBeInTheDocument();
		});
	});

	describe('No Data State', () => {
		it('does not show table wrapper when data is null', () => {
			const queryClient = createTestQueryClient();
			queryClient.setQueryData(['activeTable'], { data: null });
			renderWithQuery(<SimpleTableLayoutComponent />, queryClient);
			expect(screen.queryByTestId('table-wrapper')).not.toBeInTheDocument();
			expect(screen.getByRole('link', { name: /Return to your dashboard/i })).toBeInTheDocument();
			expect(screen.queryByTestId('new-table')).toBeInTheDocument();
			// screen.debug();
		});
	});

});
