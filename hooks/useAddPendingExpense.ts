'use client';

import { PendingExpenseI } from "@/interfaces/expenses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ObjectId } from "mongodb";

export function useAddPendingExpense() {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (data: { currentTable_id: string | ObjectId, newPendingExpense: PendingExpenseI }) => {
			return fetch('/api/expenses/table/pending', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
		},
		onError: (error) => { console.error(error); throw new Error(error.message) },
		onSuccess: async (data) => {
			const res = await data.json();
			queryClient.setQueryData(['activeTable'], res);
		}
	});

	return { mutation };
}
