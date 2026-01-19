import "colors";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { type Express } from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";

import { redisClient } from "./config/redis";

(async () => {
	redisClient.on("error", (err) => console.error("Redis Client Error", err));
	redisClient.on("ready", () => console.log("Redis Client Ready".magenta));
	await redisClient.connect();
})();

dotenv.config();

import { catch404, errorHandler } from "./middleware/errorMiddleware";

// Import Routes
import authRoute from "./routes/authRoute";
import bookmarkRoute from "./routes/bookmarkRoute";
import commentRoute from "./routes/commentRoute";
import likeRoute from "./routes/likeRoute";
import postRoute from "./routes/postRoute";
import userRoute from "./routes/userRoute";

const { PORT, NODE_ENV, CLIENT_ROOT_URL } = process.env;
const port = PORT || 3000;

const app: Express = express();

app.set("trust proxy", 1);

const allowedOrigins = [
	// CLIENT_ROOT_URL,
	"https://bird-app-nu.vercel.app",
	"http://localhost:5173",
	"http://localhost:4173",
	"https://bird-app.up.railway.app",
	"http://127.0.0.1:5173",
	"http://127.0.0.1:6379",
];

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	limit: 250, // Limit each IP to requests per `window` (here, per 1 minute).
	standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false,
});

const isProd = NODE_ENV !== "development";
const isVercelPreview = (origin: string) =>
	/^https:\/\/.*\.vercel\.app$/.test(origin);

// Middleware
if (isProd) app.use(limiter);
app.use(morgan(isProd ? "combined" : "dev"));
app.use(cookieParser());
app.use(
	cors({
		origin: (origin, callback) => {
			console.log("CORS origin:", origin);

			if (
				!origin || // same-origin / server-to-server
				allowedOrigins.includes(origin) ||
				isVercelPreview(origin)
			) {
				callback(null, true);
			} else {
				callback(new Error(`CORS blocked origin: ${origin}`));
			}
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);
app.options("*", cors());

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/account", authRoute);
app.use("/user", userRoute);
app.use("/posts", postRoute);
app.use("/comments", commentRoute);
app.use("/likes", likeRoute);
app.use("/bookmark", bookmarkRoute);

// Error Middleware
app.use(catch404);
app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`.cyan);
});
