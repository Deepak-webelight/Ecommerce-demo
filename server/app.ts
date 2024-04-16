import express, { Request, Response } from "express";
import cors from "cors";
import connectDb from "./config/connectDB";
import envProvider from "./utils/envProvider.utils";
import userRoutes from "./routes/user.routes";

const app = express();
app.use(express.json());
app.use(cors());

// call bellow server routes 
app.use("/auth", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from gateway!");
});

connectDb()
  .then(() => {
    app.listen(envProvider.port, () => {
      console.log(
        "Server is fire at " + `http://localhost:${envProvider.port} 🚀`
      );
    });
  })
  .catch((err) => console.error(err));
