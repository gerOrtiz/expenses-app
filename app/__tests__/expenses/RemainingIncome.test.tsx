import RemainingIncome from "@/components/simpleTable/income/RemainingIncome";
import { ExpensesTableI } from "@/interfaces/expenses";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock('../../../components/simpleTable/income/AddIncomeDialog', () => {
	return function MockAddIncomeDialog() {
		return <div data-testid="add-income">Add Income Dialog</div>;
	};
});
jest.mock('../../../components/simpleTable/income/AddedIncome.dialog', () => {
	return function MockAddedIncomeDialog() {
		return <div data-testid="added-income">Add Income Dialog</div>;
	};
});

describe('RemainingIncome', () => {
	const mockTableData: ExpensesTableI = {
		user_id: 'test@test.com',
		_id: '507f1f77bcf86cd799439011',
		totals: {
			total_expenses: { cash: 100, card: 500 },
			total_pending: { cash: 150, card: 200 },
			total_payments_made: { cash: 0, card: 0 }
		},
		remaining: { card: 400, cash: 300 },
		income: { cash: 600, card: 1000 },
		added: [{ date: 1778226722000, isWithdrawal: false, card: 0, cash: 100 }],
		expenses: [
			{ id: '1', amount: 100, description: 'Groceries', type: 'cash', date: new Date().getTime(), isPending: false },
			{ id: '2', amount: 500, description: 'Rent', type: 'card', date: new Date().getTime(), isPending: false },
		],
		pending: [],
		sDate: new Date().getTime(),
		fDate: 0,
		status: 'active'
	};

	beforeEach(() => {
		render(<RemainingIncome remaining={mockTableData.remaining} totals={mockTableData.totals} added={mockTableData.added} />)
	});
	afterEach(() => {
		cleanup();
	});
	it('should open dialog with CTA buttons (desktop)', async () => {
		const user = userEvent.setup();
		const button = screen.getByRole('button', { name: /add income/i });
		expect(button).toBeInTheDocument();
		await user.click(button);
		expect(await screen.findByTestId('add-income')).toBeInTheDocument();
	});
	it('should open dialog with CTA buttons (mobile)', async () => {
		const user = userEvent.setup();
		const button = screen.getByRole('button', { name: /add new income/i });
		expect(button).toBeInTheDocument();
		await user.click(button);
		expect(await screen.findByTestId('add-income')).toBeInTheDocument();
	});

	it('should display accurate data in cards', () => {
		const headings = screen.getAllByRole('heading', { level: 4 });
		expect(headings.length).toBe(4);
		//Remaining cash
		expect(headings[0]).toHaveTextContent('$300.00');
		//Remaining card
		expect(headings[1]).toHaveTextContent('$400.00');
		//Total remaining
		expect(headings[2]).toHaveTextContent('$700.00');
		//After payments: total remaining- (pending cash + pending card)
		expect(headings[3]).toHaveTextContent('$350.00');
	});

	it('should show last added info', () => {
		const addedSection = screen.getByTestId('added');
		const paragraphs = within(addedSection).getAllByRole('paragraph');
		expect(paragraphs.length).toBe(2);
		expect(paragraphs[0]).toHaveTextContent('$100.00 - Cash');
		expect(within(addedSection).getByRole('heading', { level: 6 })).toHaveTextContent('$100.00');
	});

	it('should open added income dialog', async () => {
		const user = userEvent.setup();
		const button = screen.getByRole('button', { name: /show all income movements/i });
		expect(button).toBeInTheDocument();
		await user.click(button);
		expect(await screen.findByTestId('added-income')).toBeInTheDocument();
	});

});
