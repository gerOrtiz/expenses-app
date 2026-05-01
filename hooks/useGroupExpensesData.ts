'use client';

import { ExpenseItemI } from "@/interfaces/expenses";

type GroupedData = {
	description: string, amount: number, type: string
}
export function useGroupExpensesData(data: ExpenseItemI[]) {
	const map: GroupedData | {} = {};

	for (let index = 0; index < data.length; index++) {
		const code = data[index].description.toLocaleLowerCase().trim() + data[index].type;
		if (map[code]) {
			map[code].amount = Math.floor(map[code].amount + data[index].amount);
		} else {
			map[code] = { description: data[index].description, amount: data[index].amount, type: data[index].type };
		}
	}

	const values = Object.values<GroupedData>(map);
	values.sort((a, b) => b.amount - a.amount);
	const slicedCopy = values.slice(0, 5);

	return slicedCopy;

}
