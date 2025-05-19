// interfaces/users.ts

import { ObjectId } from "mongodb";

export interface UserI {
	_id?: string | ObjectId;
	id?: string;
	email: string;
	name?: string;
	password?: string;
	createdAt?: Date | number;
	updatedAt?: Date | number;
}

export interface UserAuthInfoI {
	email: string;
	password: string;
}

export interface UserSessionI {
	id: string;
	email: string;
	name?: string;
}
