'use client';

import { PendingExpenseI } from "@/interfaces/expenses";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdatePendingExpense() {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (data: { pendingExpense: PendingExpenseI }) => {
			return fetch('/api/expenses/table/pending', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
		},
		onError: (error) => {
			console.error(error);
			throw new Error(error.message);
		},
		onSuccess: async (data) => {
			const res = await data.json();
			queryClient.setQueryData(['activeTable'], res);
		}
	});

	return { mutation };

}
