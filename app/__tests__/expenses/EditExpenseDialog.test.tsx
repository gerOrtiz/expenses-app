global.fetch = jest.fn();
jest.mock('@material-tailwind/react', () => ({
	...jest.requireActual('@material-tailwind/react'),
	Dialog: ({ children, open }: any) => (open ? <div>{children}</div> : null)
}));
import EditExpenseDialog from "@/components/dashboard/expenses/EditExpenseDialog";

import { ExpenseItemI } from "@/interfaces/expenses";
import { createTestQueryClient, renderWithQuery } from "@/utils/test-utils";
import { QueryClient } from "@tanstack/react-query";
import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";



describe('Edit expenses form', () => {
	let queryClient: QueryClient;
	const mockExpense: ExpenseItemI = { id: '1T', amount: 100, description: 'Groceries', type: 'cash', date: new Date().getTime(), isPending: false };

	beforeEach(() => {
		queryClient = createTestQueryClient();
		(global.fetch as jest.Mock).mockClear();

	});

	afterEach(() => {
		queryClient.clear();
		cleanup();
	});

	describe('Fetch call', () => {
		it('call mutation with correct data to update expense description and amount', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ success: true })
			});
			const user = userEvent.setup();
			const mockHandleOpen = jest.fn();
			// queryClient.setQueryData(['activeTable'], { data: mockTableData });
			renderWithQuery(<EditExpenseDialog isOpen={true} expense={mockExpense} handleOpen={mockHandleOpen} />, queryClient);

			const descriptionInput = await screen.findByRole('textbox', { name: /description/i });
			const amountInput = screen.getByRole('spinbutton', { name: /amount/i });

			await user.clear(descriptionInput);
			await user.type(descriptionInput, 'Test groceries');
			await user.clear(amountInput);
			await user.type(amountInput, '56');
			const saveButton = screen.getByRole('button', { name: /save/i });
			await user.click(saveButton);

			await waitFor(() => {
				expect((global.fetch as jest.Mock).mock.calls.length).toBe(1);
				const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
				const body = JSON.parse(options.body) as { clientExpense: ExpenseItemI }
				expect(url).toBe('/api/expenses/table/items');
				//expect(body.currentTable_id).toBe('507f1f77bcf86cd799439011');
				expect(body.clientExpense).toMatchObject({
					id: '1T',
					description: 'Test groceries',
					amount: 56,
					type: 'cash',
					date: expect.any(Number),
					isPending: false
				});
			});

		});

		it('call mutation with correct data to update expense paymethod', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ success: true })
			});
			const user = userEvent.setup();
			const mockHandleOpen = jest.fn();
			renderWithQuery(<EditExpenseDialog isOpen={true} expense={mockExpense} handleOpen={mockHandleOpen} />, queryClient);
			const paymehodSelect = await screen.findByLabelText('Paymethod');

			await user.click(paymehodSelect);
			const option = await screen.findByRole('option', { name: /card/i });
			await user.click(option);
			const saveButton = screen.getByRole('button', { name: /save/i });
			await user.click(saveButton);

			await waitFor(() => {
				expect((global.fetch as jest.Mock).mock.calls.length).toBe(1);
				const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
				const body = JSON.parse(options.body) as { clientExpense: ExpenseItemI }
				expect(url).toBe('/api/expenses/table/items');
				// expect(body.currentTable_id).toBe('507f1f77bcf86cd799439011');
				expect(body.clientExpense).toMatchObject({
					id: '1T',
					description: 'Groceries',
					amount: 100,
					type: 'card',
					date: expect.any(Number),
					isPending: false
				});
			});
		});

	});

	describe('Validations', () => {
		it('should display empty validation errors', async () => {
			const user = userEvent.setup();
			const mockHandleOpen = jest.fn();
			renderWithQuery(<EditExpenseDialog isOpen={true} expense={mockExpense} handleOpen={mockHandleOpen} />, queryClient);

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
			renderWithQuery(<EditExpenseDialog isOpen={true} expense={mockExpense} handleOpen={mockHandleOpen} />, queryClient);

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
