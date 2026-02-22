'use client';

import { useCallback, useMemo } from "react";


export function useMoneyFilter(numberValue?: number) {

	const formatValue = useCallback((value: number) => {
		if (typeof value !== 'number') return '$0.00';
		return value.toLocaleString('en-US', {
			style: 'currency',
			currency: 'USD'
		});
	}, []);

	const moneyFilter = useMemo(() => {
		return numberValue !== undefined ? formatValue(numberValue) : '$0.00';
	}, [numberValue]);

	return { moneyFilter, formatValue };
}
