global.fetch = jest.fn();

import AddIncomeDialog from "@/components/simpleTable/income/AddIncomeDialog";
import { createTestQueryClient, renderWithQuery } from "@/utils/test-utils";
import { QueryClient } from "@tanstack/react-query";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";


describe('Income-Form', () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = createTestQueryClient();
		(global.fetch as jest.Mock).mockClear();
	});

	afterEach(() => {
		queryClient.clear();
	});

	it('calls mutation with correct data for withdrawal', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => ({ success: true })
		});

		const user = userEvent.setup();
		renderWithQuery(<AddIncomeDialog isOpen={true} handleOpen={jest.fn()} />, queryClient);

		const amount = await screen.findByRole('spinbutton', { name: /amount/i });
		const submitButton = screen.getByRole('button', { name: /add/i });

		await user.clear(amount);
		await user.type(amount, '100');

		await user.click(submitButton);
		await waitFor(() => {
			const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
			const body = JSON.parse(options.body);

			expect(url).toBe('/api/expenses/table');
			expect(body.newIncomeData).toMatchObject({
				cash: 100,
				card: 0,
				isWithdrawal: true,
				date: expect.any(Number)
			});

		});
	});

	it('calls mutation with correct data for added income', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => ({ success: true })
		});

		const user = userEvent.setup();
		renderWithQuery(<AddIncomeDialog isOpen={true} handleOpen={jest.fn()} />, queryClient);

		const incomeTabButton = await screen.findByRole('tab', { name: /income/i });
		expect(incomeTabButton).toBeInTheDocument();

		await user.click(incomeTabButton);

		const cashInput = await screen.findByRole('spinbutton', { name: /cash/i });
		const cardInput = await screen.findByRole('spinbutton', { name: /card/i });

		await user.clear(cashInput);
		await user.type(cashInput, '100');
		await user.clear(cardInput);
		await user.type(cardInput, '100');

		const submitButton = screen.getByRole('button', { name: /add/i });
		await user.click(submitButton);
		await waitFor(() => {
			const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
			const body = JSON.parse(options.body);

			expect(url).toBe('/api/expenses/table');
			expect(body.newIncomeData).toMatchObject({
				cash: 100,
				card: 100,
				isWithdrawal: false,
				date: expect.any(Number)
			});
		});
	});


	describe('Validations', () => {
		it('shows required validation errors', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ success: true })
			});
			const user = userEvent.setup();
			renderWithQuery(<AddIncomeDialog isOpen={true} handleOpen={jest.fn()} />, queryClient);

			const submitButton = screen.getByRole('button', { name: /add/i });
			const amount = await screen.findByRole('spinbutton', { name: /amount/i });
			await user.clear(amount);
			const incomeTabButton = await screen.findByRole('tab', { name: /income/i });
			await user.click(incomeTabButton);
			const cashInput = await screen.findByRole('spinbutton', { name: /cash/i });
			const cardInput = await screen.findByRole('spinbutton', { name: /card/i });
			await user.clear(cashInput);
			await user.clear(cardInput);
			await user.click(submitButton);

			const alerts = await screen.findAllByRole('alert');
			expect(alerts.length).toBe(3);

			for (let index = 0; index < alerts.length; index++) {
				const element = alerts[index];
				expect(element).toHaveTextContent('This field is required');
			}
		});
		it('shows required validation errors', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ success: true })
			});
			const user = userEvent.setup();
			renderWithQuery(<AddIncomeDialog isOpen={true} handleOpen={jest.fn()} />, queryClient);

			const submitButton = screen.getByRole('button', { name: /add/i });

			const incomeTabButton = await screen.findByRole('tab', { name: /income/i });
			await user.click(incomeTabButton);
			const cashInput = await screen.findByRole('spinbutton', { name: /cash/i });
			const cardInput = await screen.findByRole('spinbutton', { name: /card/i });
			await user.clear(cashInput);
			await user.type(cashInput, '0');
			await user.clear(cardInput);
			await user.type(cardInput, '0');
			await user.click(submitButton);

			const alert = await screen.findByRole('alert');
			expect(alert).toBeInTheDocument();
			expect(alert).toHaveTextContent('At least one number must be positive');

		});

	});

});
