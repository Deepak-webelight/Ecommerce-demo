import userModel, { IuserDocument } from "../models/user.model";
import { ILoginRequestbody, IResisterRequestbody } from "../routes/user.routes";
import { createHashPassword, verifyPassword } from "../utils/bcrypt";
import { IgenerateToken, createNewToken, verifyToken } from "../utils/jwt";

export class UserService {
  async resisterNewUser({
    email,
    name,
    password,
  }: IResisterRequestbody): Promise<IuserDocument> {
    try {
      // Check if user already exists
      const userExist = await userModel.exists({ email });
      if (userExist) {
        throw new Error("User already exists");
      }

      // encrypt the password
      const hashPassword = await createHashPassword(password);

      // register as new user
      const registeredUser = new userModel({
        email,
        name,
        password: hashPassword,
      });

      return registeredUser.save();
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
  async validiateUser({
    email,
    password,
  }: ILoginRequestbody): Promise<IuserDocument> {
    try {
      // check user data
      const user = await userModel.findOne({ email });

      if (!user) {
        throw new Error("User does not exist");
      }

      // validate user password
      const validate = await verifyPassword(password, user.password);

      if (!validate) {
        throw new Error("Invalid password");
      }

      return user;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
  async refreshToken(token: string): Promise<string> {
    try {
      const { userId } = verifyToken(token) as IgenerateToken;

      return createNewToken(userId, "1d");
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
  generateTokens(userId: string): { token: string; refreshToken: string } {
    const token = createNewToken(userId, "1d");
    const refreshToken = createNewToken(userId, "3m");

    return { token, refreshToken };
  }
}
