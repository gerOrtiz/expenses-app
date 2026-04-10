'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeletePendingExpense() {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (data: { pendingExpenseId: string }) => {
			return fetch(`/api/expenses/table/pending?id=${data.pendingExpenseId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			});
		},
		onError: (err) => {
			console.error(err);
			throw new Error(err.message);
		}, onSuccess: async (data) => {
			const res = await data.json();
			queryClient.setQueryData(['activeTable'], res);
		}
	});

	return { mutation };
}
