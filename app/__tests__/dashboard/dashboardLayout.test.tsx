import DashboardlayoutComponent from "@/components/dashboard/layout/dashboardLayout";
import { ExpensesTableI } from "@/interfaces/expenses";
import { createTestQueryClient, renderWithQuery } from "@/utils/test-utils";
import { screen, waitFor } from "@testing-library/react";


jest.mock('../../../components/dashboard/cards/summaryCard', () => {
	return function MockSummaryCard() {
		return <div data-testid="summary-card">Summary Card</div>;
	};
});

jest.mock('../../../components/dashboard/cards/DashboardCharts', () => {
	return function MockDashboardCharts() {
		return <div data-testid="dashboard-charts">Dashboard Cards</div>;
	};
});

jest.mock('../../../components/loadingSkeletons/dashboardSkeleton', () => {
	return function MockDashboardSkeleton() {
		return <div data-testid="skeleton" className="animate-pulse"> Skeleton</div>;
	};
});

jest.mock('../../../components/ui/DashboardEmptyState', () => {
	return function MockDashboardEmptyState() {
		return <div data-testid="dashboard-empty-state"> Empty State</div>;
	};
});

describe('DashboardLayoutComponent', () => {
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

	describe('User Welcome Message', () => {
		it('displays welcome message with username', () => {
			const queryClient = createTestQueryClient();
			queryClient.setQueryData(['activeTable'], { data: mockTableData });

			renderWithQuery(<DashboardlayoutComponent username="John" />, queryClient);

			expect(screen.getByText(/welcome,/i)).toBeInTheDocument();
			expect(screen.getByText('John')).toBeInTheDocument();
		});

	});

	describe('Loading State', () => {
		it('shows skeleton when fetching ', () => {
			const queryClient = createTestQueryClient();
			// Don't set any data → query will be pending/fetching

			renderWithQuery(<DashboardlayoutComponent username="John" />, queryClient);

			// Skeleton should be visible
			expect(screen.getByTestId('skeleton')).toBeInTheDocument();
			expect(screen.getByTestId('skeleton')).toHaveClass('animate-pulse');

			// SummaryCard should NOT be rendered
			expect(screen.queryByTestId('summary-card')).not.toBeInTheDocument();
			expect(screen.queryByTestId('dashboard-charts')).not.toBeInTheDocument();

		});


	});

	describe('Success State with Data', () => {
		it('shows SummaryCard when data is successfully loaded', () => {
			const queryClient = createTestQueryClient();
			queryClient.setQueryData(['activeTable'], { data: mockTableData });

			renderWithQuery(<DashboardlayoutComponent username="John" />, queryClient);

			// SummaryCard should be visible
			expect(screen.getByTestId('summary-card')).toBeInTheDocument();

			// Skeleton should NOT be visible
			expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
		});

		it('shows Dashboard charts when data is loaded', () => {
			const queryClient = createTestQueryClient();
			queryClient.setQueryData(['activeTable'], { data: mockTableData });

			renderWithQuery(<DashboardlayoutComponent username="John" />, queryClient);

			expect(screen.getByTestId('dashboard-charts')).toBeInTheDocument();
			expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
		});
	});

	describe('No Data State', () => {
		it('does not show SummaryCard when data is null', () => {
			const queryClient = createTestQueryClient();
			queryClient.setQueryData(['activeTable'], { data: null });

			renderWithQuery(<DashboardlayoutComponent username="John" />, queryClient);

			// SummaryCard should NOT be visible
			expect(screen.queryByTestId('summary-card')).not.toBeInTheDocument();

			// DashboardCharts should NOT be visible
			expect(screen.queryByTestId('dashboard-charts')).not.toBeInTheDocument();

			expect(screen.getByTestId('dashboard-empty-state')).toBeInTheDocument();
		});
	});

	describe('Error Handling', () => {
		beforeAll(() => {
			// Suppress console.error for this test to avoid noise
			jest.spyOn(console, 'error').mockImplementation(() => { });
		});

		afterAll(() => {
			(console.error as jest.Mock).mockRestore();
		});

		it('handles fetch error gracefully', async () => {
			// Mock fetch to return 500 error
			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: false,
					status: 500,
					json: () => Promise.resolve({ error: 'Internal Server Error' }),
				} as Response)
			);

			const queryClient = createTestQueryClient();

			renderWithQuery(<DashboardlayoutComponent username="John" />, queryClient);

			// Wait for the query to fail
			await waitFor(() => {
				// Check that error boundary or error UI is shown
				// Since your component doesn't have explicit error UI,
				// this would trigger Next.js error.tsx page
				const queryState = queryClient.getQueryState(['activeTable']);
				expect(queryState?.status).toBe('error');
			});

			// Clean up
			(global.fetch as jest.Mock).mockRestore();
		});

		it('throws error when fetch fails with 500', async () => {
			// Mock fetch to simulate server error
			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: false,
					status: 500,
					statusText: 'Internal Server Error',
				} as Response)
			);

			const queryClient = createTestQueryClient();

			// Render and wait for error
			renderWithQuery(<DashboardlayoutComponent username="John" />, queryClient);

			await waitFor(() => {
				const error = queryClient.getQueryState(['activeTable'])?.error;
				expect(error).toBeDefined();
				expect((error as Error).message).toBe('Failed to fetch active table');
			});

			(global.fetch as jest.Mock).mockRestore();
		});
	});


});
