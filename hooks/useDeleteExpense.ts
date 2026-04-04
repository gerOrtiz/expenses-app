'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ObjectId } from "mongodb";

export function useDeleteExpense() {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (data: { currentTable_id: string | ObjectId, clientExpenseId: string }) => {
			return fetch('/api/expenses/table/items', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
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
