// interfaces/common.ts

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface PaginationParams {
	page: number;
	limit: number;
}

export interface PaginatedResult<T> {
	items: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface DateRange {
	startDate: Date | string;
	endDate: Date | string;
}
