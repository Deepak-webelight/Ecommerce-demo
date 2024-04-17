import mongoose from "mongoose";
import appConfig from "./appConfig";

const connectDb = async () => {
  if (!appConfig.mongodbUrl) throw new Error("MONGODB_URI is required");
  try {
    const response = await mongoose.connect(appConfig.mongodbUrl);
    console.log("Connected to MongoDB ");
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
};
export default connectDb;
