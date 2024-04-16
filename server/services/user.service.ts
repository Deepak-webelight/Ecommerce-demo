import userModel, { IuserDocument } from "../models/user.model";
import { ILoginRequestbody, IResisterRequestbody } from "../routes/user.routes";

export class UserService {
  async isUserExist(email: string): Promise<boolean> {
    try {
      const userExists = await userModel.exists({ email });
      return !!userExists;
    } catch (err) {
      return false;
    }
  }
  async resisterNewUser({
    email,
    name,
    password,
  }: IResisterRequestbody): Promise<IuserDocument | Error> {
    try {
      // Check if user already exists
      const userExist = await this.isUserExist(email);
      if (userExist) {
        return Error("User already exists");
      }
      // register as new user
      const registeredUser = await new userModel({ email, name, password });
      const savedUser = registeredUser.save();

      return savedUser;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
  async validiateUser({
    email,
    password,
  }: ILoginRequestbody): Promise<IuserDocument | Error> {
    try {
      // if user not existing
      const isUserExist = await this.isUserExist(email);
      if (!isUserExist) {
        return Error("User does not exist");
      }

      // validate email password

      const validiateUser = await userModel.findOne({ email, password });
      if (validiateUser) return validiateUser;
      else return Error("Invalid email or password");
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}
