import ReportsLayout from "@/components/reports/layout/ReportsLayout";
import { ExpensesTableI } from "@/interfaces/expenses";
import { createTestQueryClient, renderWithQuery } from "@/utils/test-utils";
import { cleanup, screen, within } from "@testing-library/react";


jest.mock('../../../components/ui/DateRangeDialog', () => {
	return function MockDateRangeDialog() {
		return <div data-testid="date-range">Date range </div>;
	};
});

jest.mock('../../../components/loadingSkeletons/reportsSkeleton', () => {
	return function MockReportsSkeleton() {
		return <div data-testid="skeleton" className="animate-pulse">Skeleton</div>;
	};
});

jest.mock('../../../components/reports/charts/TotalsCharts', () => {
	return function MockTotalsCharts() {
		return <div data-testid="totals-charts">Totals</div>;
	};
});
jest.mock('../../../components/reports/charts/ExpensesChart', () => {
	return function MockExpensesChart() {
		return <div data-testid="expenses-chart">Top expenses</div>;
	};
});


describe('Reports Layout', () => {
	let queryClient = createTestQueryClient();
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
		status: 'closed'
	};

	afterEach(() => {
		queryClient.clear();
		cleanup();
	});

	describe('Loading State', () => {
		it('shows skeleton when fetching ', () => {
			queryClient = createTestQueryClient();
			// Don't set any data → query will be pending/fetching
			renderWithQuery(<ReportsLayout />, queryClient);
			// Skeleton should be visible
			expect(screen.getByTestId('skeleton')).toBeInTheDocument();
			expect(screen.getByTestId('skeleton')).toHaveClass('animate-pulse');
			// Date range should NOT be rendered
			expect(screen.queryByTestId('date-range')).not.toBeInTheDocument();
		});
	});

	describe('No Data State', () => {
		it('does not show SummaryCard when data is null', () => {
			queryClient = createTestQueryClient();
			queryClient.setQueryData(['reports', 'expenses', {}], { data: null });
			renderWithQuery(<ReportsLayout />, queryClient);

			// Skeleton should NOT be visible
			expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
			//Title should be visible
			const headings = screen.getAllByRole('heading', { level: 2 });
			expect(headings.length).toBe(2);
			expect(headings[0]).toHaveTextContent('Reports');
			expect(headings[1]).toHaveTextContent('No data available');

			//Empty state component should be visible
			expect(screen.getByTestId('reports-empty-state')).toBeInTheDocument();
			//Have an image and no CTA buttons
			const image = screen.getByRole('img');
			expect(image).toHaveAttribute('alt', 'No data illustration');
			expect(screen.queryByRole('button')).not.toBeInTheDocument();
		});
	});

	describe('Success State with Data', () => {
		it('shows reports cards with accurate data', () => {
			queryClient = createTestQueryClient();
			queryClient.setQueryData(['reports', 'expenses', {}], { data: mockTableData });
			renderWithQuery(<ReportsLayout />, queryClient);
			const cardsWrapper = screen.queryByTestId('report-cards');
			expect(cardsWrapper).toBeInTheDocument();
			expect(within(cardsWrapper).getByText('Total spent')).toBeInTheDocument();
			expect(within(cardsWrapper).getByText('Number of transactions')).toBeInTheDocument();
			expect(within(cardsWrapper).getByText('Number of payments')).toBeInTheDocument();
			expect(within(cardsWrapper).getByText('% spent')).toBeInTheDocument();

			const cardsHeadings = within(cardsWrapper).getAllByRole('heading', { level: 4 });
			expect(cardsHeadings.length).toBe(4);
			expect(cardsHeadings[0]).toHaveTextContent('$600.00');
			expect(cardsHeadings[1]).toHaveTextContent('2');
			expect(cardsHeadings[2]).toHaveTextContent('0');
			expect(cardsHeadings[3]).toHaveTextContent('37.50%');
			//const totalBudget = 1600 + 0;
			//const percentageSpent = ((totalExpenses / totalBudget) * 100).toFixed(2) + '%';
		});

		it('shows tables with correct headers', () => {
			queryClient = createTestQueryClient();
			queryClient.setQueryData(['reports', 'expenses', {}], { data: mockTableData });
			renderWithQuery(<ReportsLayout />, queryClient);
			const tables = screen.getAllByRole('table');
			expect(tables.length).toBe(2);
			const expensesTableHeaders = within(tables[0]).getAllByRole('columnheader');
			expect(expensesTableHeaders.length).toBe(4);
			expect(expensesTableHeaders[0]).toHaveTextContent(/description/i);
			expect(expensesTableHeaders[1]).toHaveTextContent(/amount/i);
			expect(expensesTableHeaders[2]).toHaveTextContent(/paymethod/i);
			expect(expensesTableHeaders[3]).toHaveTextContent(/date/i);
			expect(within(tables[0]).getAllByRole('row').length).toBe(3);

			expect(within(tables[1]).getAllByRole('row').length).toBe(1);
			const pendingTabaleHeaders = within(tables[0]).getAllByRole('columnheader');
			expect(pendingTabaleHeaders[0]).toHaveTextContent(/description/i);
			expect(pendingTabaleHeaders[1]).toHaveTextContent(/amount/i);
			expect(pendingTabaleHeaders[2]).toHaveTextContent(/paymethod/i);

		});

		it('renders charts', () => {
			queryClient = createTestQueryClient();
			queryClient.setQueryData(['reports', 'expenses', {}], { data: mockTableData });
			renderWithQuery(<ReportsLayout />, queryClient);
			expect(screen.getByTestId('totals-charts')).toBeInTheDocument();
			expect(screen.getByTestId('expenses-chart')).toBeInTheDocument();

		});

	});

});
