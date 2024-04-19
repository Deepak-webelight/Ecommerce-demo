import { hash, compare, genSalt } from "bcryptjs";

export const createHashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await genSalt(10);
    return hash(password, salt);
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export const verifyPassword = (
  plainPassword: string,
  hashedPassword: string
) => {
  try {
    return compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error((error as Error).message);
  }
};