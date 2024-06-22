import "colors";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

import { catch404, errorHandler } from "./middleware/errorMiddleware";

// Import Routes
import taskRoute from "./routes/taskRoute";
import userRoute from "./routes/userRoute";

const { PORT, NODE_ENV } = process.env;
const port = PORT || 3000;
const node_env = NODE_ENV || "development";

const app: Express = express();
app.set("trust proxy", 1);

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

// Middleware
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/account", userRoute);
app.use("/", taskRoute);

// Error Middleware
app.use(catch404);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`.cyan);
});
