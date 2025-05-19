import { CategoryI } from "./categories";

export interface AccountMovementI {
	user_id: string;
	status: 'open' | 'closed';
	sDate: number;
	fDate: number;
	initBalance: number;
	remaining: number;
	incomes: IncomeI[] | [];
	expenses: ExpenseI[] | [];
	total_expenses: number;
	total_withdrawals: number;
}

export interface IncomeI {
	name: string;
	amount: number;
	date: number;
}

interface ExpenseI {
	amount: number;
	description: string;
	category?: string;
	subcategory?: string;
	date: number;
}

export interface AccountI {
	user_id: string;
	last_balance: number; // Current/latest balance
	savings_pots?: SavingsPotI[]; // For future implementation
	movement_history?: {
		period_id: string; // Reference to closed movement periods
		start_date: number;
		end_date: number;
		starting_balance: number;
		ending_balance: number;
	}[]; // Track history of closed periods
}

// For future implementation
export interface SavingsPotI {
	id: string;
	name: string;
	target_amount?: number; // Optional target amount
	current_amount: number;
	description?: string;
	category?: string; // What this savings is for (rent, vacation, etc.)
}

export interface TransferI {
	from: 'balance' | string; // 'balance' or pot_id
	to: 'balance' | string; // 'balance' or pot_id
	amount: number;
	date: number;
	description?: string;
}
