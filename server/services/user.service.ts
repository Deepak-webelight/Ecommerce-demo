import appConfig from "../config/appConfig";
import userModel, { IuserDocument } from "../models/user.model";
import { ILoginRequestbody, IResisterRequestbody } from "../routes/user.routes";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export interface IgenerateToken {
  userId: string;
}

export class UserService {
  async resisterNewUser({
    email,
    name,
    password,
  }: IResisterRequestbody): Promise<IuserDocument | Error> {
    try {
      // Check if user already exists
      const userExist = await userModel.exists({ email });
      if (userExist) {
        throw new Error("User already exists");
      }

      // encrypt the password
      const hashPassword = await this.hashPassword(password);

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
      const validate = await this.verifyPassword(password, user.password);

      if (!validate) {
        throw new Error("Invalid password");
      }

      return user;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
  generateTokens(userId: string): { token: string; refreshToken: string } {
    const token = this.createNewToken(userId, "1d");
    const refreshToken = this.createNewToken(userId, "3m");

    return { token, refreshToken };
  }
  createNewToken(userId: string, expiresIn: "1d" | "3m"): string {
    if (!appConfig.jwtSecret) {
      throw Error("Invalid token secret");
    }
    return jwt.sign({ userId }, appConfig.jwtSecret, {
      expiresIn,
    });
  }
  verifyToken(token: string): jwt.JwtPayload | string | boolean {
    if (!appConfig.jwtSecret) throw Error("Invalid token secret");
    try {
      return jwt.verify(token, appConfig.jwtSecret);
    } catch (err) {
      return false;
    }
  }
  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw error;
    }
  }
  async verifyPassword(plainPassword: string, hashedPassword: string) {
    try {
      const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
      return isMatch;
    } catch (error) {
      throw error;
    }
  }
}
