export interface CategoryI {
	name: string;
	children: { name: string; color?: string; }[] | [];
	color?: string;
}

export interface CategoriesI {
	user_id: string;
	_id?: string;
	id?: string;
	categories: CategoryI[];
}
