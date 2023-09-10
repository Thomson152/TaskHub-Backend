import express from "express";
import connectDB from "./config/db.js";
import http from "http";
import dotenv from "dotenv";
import taskRoute from "./routes/taskRoute.js";
import userRoute from "./routes/userRoute.js";
import errorHandler from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT;
connectDB();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/tasks", taskRoute);
app.use("/api/user", userRoute);



app.use(errorHandler);
app.listen(port, () => {
  console.log(`Running on PORT ${process.env.PORT}`);
});
