'use client';
import { ExpensesTableI } from "@/interfaces/expenses";
import { useQuery } from "@tanstack/react-query";

type tableData = {
	data: null | ExpensesTableI
}

export function useActiveTable() {
	const { status, data, isFetching, error } = useQuery({
		queryKey: ['activeTable'], queryFn: async (): Promise<tableData> => {
			const res = await fetch('/api/expenses/table');
			if (!res.ok) throw new Error('Failed to fetch active table');
			return res.json();
		},
		staleTime: 1000 * 60 * 5,
		select: (response: tableData) => {
			if (response && response.data) {
				const newData = { ...response.data, id: response.data._id.toString() };
				delete newData._id;
				return { data: newData };
			} else return { data: null };
		}
	});

	return {
		status,
		data,
		isFetching,
		error
	};

}
