import express, { Request, Response, Express } from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import connectDb from "./config/connectDb";
import envProvider from "./utils/envProvider";

const app: Express = express();
app.use(express.json());
app.use(cors());
app.use("/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from gateway!");
});

connectDb()
  .then(() => {
    app.listen(envProvider.PORT, () => {
      console.log(
        "Server is fire at " + `http://localhost:${envProvider.PORT} 🚀`
      );
    });
  })
  .catch((err) => console.error(err));
