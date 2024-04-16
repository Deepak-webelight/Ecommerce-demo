import mongoose from "mongoose";
import envProvider from "../utils/envProvider.utils";

const connectDb = async () => {
  if (!envProvider.mongodbUrl) throw new Error("MONGODB_URI is required");
  try {
    const response = await mongoose.connect(envProvider.mongodbUrl);
    console.log("Connected to MongoDB ");
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
};
export default connectDb;
