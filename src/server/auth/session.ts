import { compare, hash } from 'bcryptjs';

export async function hashPassword(password: string) {
  return hash(password, 10);
}

export async function comparePasswords(plainTextPassword: string, hashedPassword: string) {
  return compare(plainTextPassword, hashedPassword);
}
