import "colors";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import http from "http";
import morgan from "morgan";
import Stripe from "stripe";
import WebSocket, { Server } from "ws";

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

const { PORT, NODE_ENV, CLIENT_ROOT_URL, STRIPE_SECRET_KEY } = process.env;
const port = PORT || 3000;

const app: Express = express();
const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

app.set("trust proxy", 1);

const allowedOrigins = [
  CLIENT_ROOT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:6379",
];

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 250, // Limit each IP to requests per `window` (here, per 1 minute).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false,
});

// Middleware
NODE_ENV !== "development" ? app.use(limiter) : null;
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

app.use("/account", authRoute);
app.use("/user", userRoute);
app.use("/posts", postRoute);
app.use("/comments", commentRoute);
app.use("/likes", likeRoute);
app.use("/bookmark", bookmarkRoute);

app.post("/create-payment-intent", async (req: Request, res: Response) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

// Error Middleware
app.use(catch404);
app.use(errorHandler);

// Create HTTP server for Express and WebSocket
const server = http.createServer(app);

const wss = new Server({ port: 3001 });

const users: Map<WebSocket, { username: string }> = new Map(); // Track users and their WebSocket connection

wss.on("connection", (ws: WebSocket) => {
  console.log("New connection established");

  ws.on("message", (message: string) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case "join":
        // Save the user's username when they join
        users.set(ws, { username: data.username });
        console.log(`${data.username} joined the chat`);
        break;

      case "message":
        // Handle sending a message to a private room
        const { content, toUsername } = data;
        const fromUser = users.get(ws)?.username;

        if (fromUser && toUsername) {
          // Find the recipient WebSocket connection by username
          for (let [socket, user] of users.entries()) {
            if (user.username === toUsername) {
              // Send the message to the recipient
              socket.send(
                JSON.stringify({
                  type: "message",
                  content,
                  username: fromUser,
                  toUsername,
                })
              );
              // Optionally send a confirmation to the sender
              ws.send(
                JSON.stringify({
                  type: "message",
                  content,
                  username: fromUser,
                  toUsername,
                })
              );
            }
          }
        }
        break;

      case "leave":
        // Remove the user from the connection map when they leave
        users.delete(ws);
        console.log(`${data.username} left the chat`);
        break;
    }
  });

  ws.on("close", () => {
    // Clean up the user when the connection closes
    users.forEach((user, socket) => {
      if (socket === ws) {
        users.delete(socket);
      }
    });
    console.log("Connection closed");
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`.cyan);
});
