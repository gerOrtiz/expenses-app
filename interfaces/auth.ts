// interfaces/auth.ts
import { UserI } from './users';

export interface AuthCredentialsI {
	email: string;
	password: string;
}

export interface AuthResultI {
	success: boolean;
	user?: UserI;
	message?: string;
}

export interface PasswordResetRequestI {
	email: string;
	token?: string;
}

export interface PasswordChangeRequestI {
	userId: string;
	currentPassword: string;
	newPassword: string;
}
