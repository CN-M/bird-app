import { NextFunction, Request, Response } from "express";
import createError from "http-errors";

// Catch 404 errors and forward to error handler
export const catch404 = (req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
};

// Error Handler
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
