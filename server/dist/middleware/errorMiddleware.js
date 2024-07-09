"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.catch404 = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
// Catch 404 errors and forward to error handler
const catch404 = (req, res, next) => {
    next((0, http_errors_1.default)(404));
};
exports.catch404 = catch404;
// Error Handler
const errorHandler = (err, req, res, next) => {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // Send JSON response for errors
    res.status(err.status || 500).json({
        error: {
            status: err.status || 500,
            message: err.message || "Internal Server Error",
        },
    });
};
exports.errorHandler = errorHandler;
