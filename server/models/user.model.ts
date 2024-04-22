import { Schema, model, Document } from "mongoose";

export interface IuserModel {
  name: string;
  email: string;
  password: string;
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
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const userModel = model<IuserDocument>("User", userModelSchema);
export default userModel;
