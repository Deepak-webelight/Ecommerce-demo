import mongoose from "mongoose";
import envProvider from "../utils/envProvider";

const connectDb = async () => {
  if (!envProvider.MONGODB_URL) throw new Error("MONGODB_URI is required");
  try {
    const response = await mongoose.connect(envProvider.MONGODB_URL);
    console.log("Connected to MongoDB ");
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
};
export default connectDb;
