'use client';

import { useActiveTable } from "./useActiveTable";



export function useActiveTableId() {
	const { data, status } = useActiveTable();

	if (status === 'success' && data.data !== null) return data.data._id;
	else return null;
}
