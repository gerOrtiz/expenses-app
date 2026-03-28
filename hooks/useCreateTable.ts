'use client';

import { IncomeI } from "@/interfaces/expenses";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateTable() {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (data: IncomeI) => {
			return fetch('/api/expenses/table', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
		},
		onError: (error) => {
			console.log(error);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['activeTable'] });
		}
	});

	return { mutation };
}
