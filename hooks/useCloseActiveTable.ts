'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCloseActiveTable() {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: () => {
			return fetch('/api/expenses/table', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				// body: JSON.stringify(data)
			});
		},
		onError: (err) => {
			console.error(err);
			throw new Error(err.message);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['activeTable'] });
		}
	});

	return { mutation };
}
