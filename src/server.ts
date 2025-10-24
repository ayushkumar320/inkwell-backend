import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import express from "express";
import cors from "cors";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Inkwell Backend!");
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}/`);
});