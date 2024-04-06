import { compare, hash } from "bcryptjs";


export async function hashPassword(password) {
  if (!password) return;
  const hashedPass = await hash(password, 12);
  return hashedPass;
}

export async function verifyPassword(password, hashedPass) {
  const isValid = await compare(password, hashedPass);
  return isValid;
}