'use client';

import { ExpenseItemI } from "@/interfaces/expenses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ObjectId } from "mongodb";

export function useAddExpense() {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (data: { newClientExpense: ExpenseItemI }) => {
			return fetch('/api/expenses/table/items', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
		},
		onError: (error) => { console.error(error); throw new Error(error.message); },
		onSuccess: async (data) => {
			const res = await data.json();
			queryClient.setQueryData(['activeTable'], res);
		}
	});

	return { mutation };
}
