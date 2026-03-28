'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';

export function createTestQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: false, // Don't retry failed queries in tests
				staleTime: Infinity, // Don't refetch in tests
			},
		},
	});
}

export function renderWithQuery(
	ui: React.ReactElement,
	queryClient?: QueryClient,
	options?: RenderOptions
) {
	const client = queryClient || createTestQueryClient();

	return {
		...render(
			<QueryClientProvider client={client}>
				{ui}
			</QueryClientProvider>,
			options
		),
		queryClient: client,
	};
}
