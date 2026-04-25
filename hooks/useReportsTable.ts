'use client';

import { ExpensesTableI } from "@/interfaces/expenses";
import { useQuery } from "@tanstack/react-query";

type TableData = {
	data: null | ExpensesTableI
}

export function useReportsTable(startDate?: number, endDate?: number) {
	const { status, data, isFetching, error } = useQuery({
		queryKey: ['reports', 'expenses', { startDate, endDate }],
		queryFn: async (): Promise<TableData> => {
			const hasRangeDates = (typeof startDate === 'number' && startDate !== 0 && typeof endDate === 'number' && endDate !== 0);
			const res = await fetch(`/api/reports/expenses${hasRangeDates ? '?startDate=' + startDate + '&endDate=' + endDate : ''}`);
			if (!res.ok) throw new Error('Failed to fetch active table');
			return res.json();
		},
		staleTime: 5 * 60 * 1000
	});

	return {
		status,
		data,
		isFetching,
		error
	};

}
