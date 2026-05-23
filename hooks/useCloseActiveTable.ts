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
		},
		onSuccess: async (data) => {
			if (!data.ok) {
				const message = await data.json();
				throw new Error(message.error)
			}
			queryClient.invalidateQueries({ queryKey: ['activeTable'] });
		}
	});

	return { mutation };
}
