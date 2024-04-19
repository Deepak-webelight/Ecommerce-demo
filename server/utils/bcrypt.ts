import { hash, compare, genSalt } from "bcryptjs";

export const createHashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(10);
  return hash(password, salt);
};

export const verifyPassword = (
  plainPassword: string,
  hashedPassword: string
) => {
  return compare(plainPassword, hashedPassword);
};
