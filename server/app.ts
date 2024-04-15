import express, { Request, Response, Express } from "express";
import cors from "cors";
import authRoutes from "./routes/auth";

const app: Express = express();

app.use(express.json());
app.use(cors());
app.use("/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

export default app;
