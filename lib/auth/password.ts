import { compare, hash } from "bcryptjs";


export async function hashPassword(password: string): Promise<string | null> {
	if (!password) return null;
	const hashedPass = await hash(password, 12);
	return hashedPass;
}

export async function verifyPassword(password: string, hashedPass: string): Promise<boolean> {
	const isValid = await compare(password, hashedPass);
	return isValid;
}
