'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ObjectId } from "mongodb";

export function useDeleteExpense() {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (data: { clientExpenseId: string }) => {
			return fetch(`/api/expenses/table/items?id=${data.clientExpenseId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				//body: JSON.stringify(data)
			});
		},
		onError: (err) => {
			console.error(err);
		}, onSuccess: async (data) => {
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
