import { Schema, model, Document } from "mongoose";

export interface IUserModel {
  Name: string;
  Email: string;
  Password: string;
}

interface IUserModelSchema extends IUserModel, Document {}

const userModelSchema = new Schema<IUserModelSchema>(
  {
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

const UserModel = model<IUserModelSchema>("User", userModelSchema);
export default UserModel;
