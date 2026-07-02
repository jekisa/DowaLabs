import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function comparePassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  if (!passwordHash) return Promise.resolve(false);
  return bcrypt.compare(password, passwordHash);
}
