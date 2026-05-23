'use client';

import { ExpenseItemI } from "@/interfaces/expenses";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useEditExpense() {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (data: { clientExpense: ExpenseItemI }) => {
			return fetch('/api/expenses/table/items', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
		},
		onError: (error) => {
			console.error(error);
		},
		onSuccess: async (data) => {
			if (!data.ok) {
				const message = await data.json();
				throw new Error(message.error)
			}
			const res = await data.json();
			queryClient.setQueryData(['activeTable'], res);
		}
	});

	return { mutation };
}
