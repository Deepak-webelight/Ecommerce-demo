import { Schema, model, Document } from "mongoose";

export interface IuserModel {
  name: string;
  email: string;
  password: string;
  access_token: string;
}

export interface IuserDocument extends IuserModel, Document {}

const userModelSchema = new Schema<IuserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    access_token: {
      type: String,
      required: false,
    },
  },
  { versionKey: false }
);

const userModel = model<IuserDocument>("User", userModelSchema);
export default userModel;
