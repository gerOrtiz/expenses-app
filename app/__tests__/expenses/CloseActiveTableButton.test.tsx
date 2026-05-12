global.fetch = jest.fn();
import CloseActiveTableButton from "@/components/simpleTable/CloseActiveTableButton";
import { createTestQueryClient, renderWithQuery } from "@/utils/test-utils";
import { QueryClient } from "@tanstack/react-query";
import { cleanup, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe('Close table button', () => {
	let queryClient: QueryClient;
	afterEach(() => {
		queryClient.clear();
		cleanup();
	});
	it('should call mutation with correct data to close active table', async () => {
		queryClient = createTestQueryClient();
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => ({ success: true })
		});
		renderWithQuery(<CloseActiveTableButton />, queryClient);
		const user = userEvent.setup();
		const actionButton = await screen.findByRole('button', { name: /close active table/i });
		await user.click(actionButton);
		const closePeriodButton = await screen.findByRole('button', { name: /Close period/i });
		expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Close expenses period');
		const alertDiv = screen.getByRole('alert');
		expect(within(alertDiv).getByText(`This action can't be undone`)).toBeInTheDocument();
		await user.click(closePeriodButton);

		await waitFor(() => {
			expect((global.fetch as jest.Mock).mock.calls.length).toBe(1);
			expect(global.fetch).toHaveBeenCalledWith(
				'/api/expenses/table', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				// body: JSON.stringify('507f1f77bcf86cd799439011')
			}
			);
		});
	});


});
