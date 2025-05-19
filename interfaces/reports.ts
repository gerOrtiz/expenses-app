// interfaces/reports.ts

export interface MovementHistoryI {
	user_id: string;
	period_records: PeriodRecordI[];
}

export interface PeriodRecordI {
	period_id: string;
	start_date: number;
	end_date: number;
	starting_balance: number;
	ending_balance: number;
	incomes: IncomeRecordI[];
	expenses: ExpenseRecordI[];
	transfers: TransferRecordI[];
	savings_pot_snapshots: SavingsPotSnapshotI[];
}

export interface IncomeRecordI {
	id: string;
	name: string;
	amount: number;
	date: number;
	category?: string;
}

export interface ExpenseRecordI {
	id: string;
	amount: number;
	description: string;
	category?: string;
	subcategory?: string;
	date: number;
}

export interface TransferRecordI {
	id: string;
	from: 'balance' | string;
	to: 'balance' | string;
	amount: number;
	date: number;
	description?: string;
}

export interface SavingsPotSnapshotI {
	pot_id: string;
	name: string;
	amount: number;
	date: number;
}

export interface ReportFilterI {
	user_id: string;
	start_date?: number;
	end_date?: number;
	categories?: string[];
	include_transfers?: boolean;
	include_savings?: boolean;
}
