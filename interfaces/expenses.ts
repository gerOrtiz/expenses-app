export interface ExpensesTableI {
	user_id: string;
	income: IncomeI;
	sDate: number;
	fDate: number;
	status: 'active' | 'finished';
	expenses: ExpenseItemI[];
	pending: PendingExpenseI[];
	totals: TotalsI;
	remaining: TotalsType;
	added: TotalsType[];
}

export interface IncomeI {
	cash: number;
	card: number;
}

export interface ExpenseItemI {
	description: string;
	type: 'cash' | 'card';
	date: number;
	isPending: boolean;
	pending_id?: string;
}

export interface PendingExpenseI {
	id: string;
	name: string;
	type: 'cash' | 'card';
	amount?: number;
	fulfilled?: boolean; // Flag to mark if this has been fulfilled
}


export interface TotalsI {
	total_expenses: TotalsType;
	total_pending: TotalsType;
	total_payments_made: TotalsType;
}

export type TotalsType = {
	cash: number;
	card: number;
}
