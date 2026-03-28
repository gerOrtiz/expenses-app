'use client';

import { AddedIncomeI } from "@/interfaces/expenses";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddIncome() {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (data: { currentTable_id: string, newIncomeData: AddedIncomeI }) => {
			return fetch('/api/expenses/table', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				}, body: JSON.stringify(data)
			});
		},
		onMutate: () => { },
		onError: (error) => {
			console.error(error);
		}, onSuccess: (data) => {
			console.log(data.json());
			queryClient.invalidateQueries({ queryKey: ['activeTable'] }); queryClient.invalidateQueries({ queryKey: ['activeTable'] });
			// queryClient.setQueryData(['budget'], updatedDocument);
		}
	});

	return { mutation };

}
