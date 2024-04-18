import mongoose from "mongoose";
import appConfig from "./appConfig";

const connectDB = async () => {
  if (!appConfig.mongodbUrl) throw Error("MONGODB_URI is required");
  try {
    return await mongoose.connect(appConfig.mongodbUrl);
  } catch (err) {
    console.log(err);
    return err;
  }
};
export default connectDB;
