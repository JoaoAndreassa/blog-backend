// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("Erro capturado:", err);

  const status = err.status || 500;
  const message = err.message || "Erro interno no servidor";

  res.status(status).json({ error: message });
};
