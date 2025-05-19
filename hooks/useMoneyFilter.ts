'use client';

import { useEffect, useState } from "react";


export function useMoneyFilter(numberValue: number) {
	const [moneyFilter, setMoneyFilter] = useState<string>('');

	useEffect(() => {
		if (typeof numberValue !== 'number') setMoneyFilter('$0');
		const formattedValue = numberValue.toLocaleString('en-US', {
			style: 'currency',
			currency: 'USD'
		});
		setMoneyFilter(formattedValue);
		return () => setMoneyFilter('');
	}, [numberValue]);

	return moneyFilter;
}
