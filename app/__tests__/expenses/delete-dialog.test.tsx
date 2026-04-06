global.fetch = jest.fn();
jest.mock('../../../hooks/useActiveTableId');
jest.mock('@material-tailwind/react', () => ({
	...jest.requireActual('@material-tailwind/react'),
	Dialog: ({ children, open }: any) => (open ? <div>{children}</div> : null)
}));

import DeleteDialog from "@/components/dashboard/expenses/delete-dialog";
import { useActiveTableId } from "@/hooks/useActiveTableId";
import { ExpenseItemI } from "@/interfaces/expenses";
import { createTestQueryClient, renderWithQuery } from "@/utils/test-utils";
import { QueryClient } from "@tanstack/react-query";
import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockUseActiveTableId = useActiveTableId as jest.MockedFunction<typeof useActiveTableId>;
const mockExpense: ExpenseItemI = { id: '1T', amount: 100, description: 'Groceries', type: 'cash', date: new Date().getTime(), isPending: false };


describe('Delete Dialog', () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = createTestQueryClient();
		(global.fetch as jest.Mock).mockClear();
		mockUseActiveTableId.mockReturnValue('507f1f77bcf86cd799439011');
	});

	afterEach(() => {
		queryClient.clear();
		cleanup();
	});

	it('calls mutation with correct data to delete an specific expense', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => ({ success: true })
		});
		const user = userEvent.setup();
		const mockHandleCancel = jest.fn();
		renderWithQuery(<DeleteDialog expense={mockExpense} onCancel={mockHandleCancel} />, queryClient);
		const deleteButton = await screen.findByRole('button', { name: /delete/i });
		await user.click(deleteButton);

		await waitFor(() => {
			expect((global.fetch as jest.Mock).mock.calls.length).toBe(1);
			expect(global.fetch).toHaveBeenCalledWith(
				'/api/expenses/table/items', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ currentTable_id: '507f1f77bcf86cd799439011', clientExpenseId: '1T' })
			}
			);
		});
	});

});
