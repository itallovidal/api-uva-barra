import * as bcrypt from "bcrypt";

async function hashPassword(plainTextPassword: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
  return hashedPassword;
}

async function verifyPassword(
  plainTextPassword: string,
  storedHash: string,
): Promise<boolean> {
  const isMatch = await bcrypt.compare(plainTextPassword, storedHash);
  return isMatch;
}

export { hashPassword, verifyPassword };
