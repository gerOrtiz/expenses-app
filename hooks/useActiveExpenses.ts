'use client';

import { useActiveTable } from "./useActiveTable";



export function useActiveExpenses() {
	const { data, status } = useActiveTable();

	if (status === 'success' && data.data !== null) return data.data.expenses;
	else return [];
}
