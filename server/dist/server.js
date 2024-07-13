"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("colors");
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = require("express-rate-limit");
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config();
const errorMiddleware_1 = require("./middleware/errorMiddleware");
// Import Routes
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const commentRoute_1 = __importDefault(require("./routes/commentRoute"));
const likeRoute_1 = __importDefault(require("./routes/likeRoute"));
const postRoute_1 = __importDefault(require("./routes/postRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const { PORT, NODE_ENV, CLIENT_ROOT_URL } = process.env;
const port = PORT || 3000;
const app = (0, express_1.default)();
app.set("trust proxy", 1);
const allowedOrigins = [
    CLIENT_ROOT_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
];
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minute
    limit: 100, // Limit each IP to  requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false,
});
// Middleware
NODE_ENV !== "development" ? app.use(limiter) : null;
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/account", authRoute_1.default);
app.use("/user", userRoute_1.default);
app.use("/posts", postRoute_1.default);
app.use("/comments", commentRoute_1.default);
app.use("/likes", likeRoute_1.default);
// Error Middleware
app.use(errorMiddleware_1.catch404);
app.use(errorMiddleware_1.errorHandler);
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`.cyan);
});
