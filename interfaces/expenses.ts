import { ObjectId } from "mongodb";

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
	added: AddedIncomeI[];
	id?: string;
	_id?: ObjectId | string;
}

export interface IncomeI {
	cash: number;
	card: number;
}

export interface ExpenseItemI {
	id?: string;
	description: string;
	type: string;
	date: number;
	isPending: boolean;
	amount: number;
	pending_id?: string;
}

// export interface PendingExpenseI {
// 	id?: number;
// 	name: string;
// 	type: string;
// 	amount: number;
// 	fulfilled?: boolean; // Flag to mark if this has been fulfilled
// }

export interface PendingExpenseI extends Omit<ExpenseItemI, 'isPending' | 'date' | 'pending_id'> {
	fulfilled?: boolean;
	originalAmount?: number;
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

export interface AddedIncomeI extends TotalsType {
	date: number;
	isWithdrawal: boolean;
}
