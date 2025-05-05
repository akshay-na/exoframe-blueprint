// src/express/RequestLogger.ts
import { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { LoggerScope, logger as rootLogger } from "../common/Logger";

export function requestLoggerMiddleware() {
  return (req: Request, res: Response, next: NextFunction): void => {
    const reqId =
      typeof req.headers["x-request-id"] === "string"
        ? req.headers["x-request-id"]
        : randomUUID();

    const child = rootLogger.child({
      reqId,
      method: req.method,
      url: req.originalUrl,
    });

    LoggerScope.runWithLogger(child, () => {
      (req as any).log = child; // optional convenience
      child.info({ query: req.query }, "↗︎ incoming");

      const t0 = Date.now();
      res.on("finish", () => {
        child.info(
          { statusCode: res.statusCode, duration_ms: Date.now() - t0 },
          "↘︎ completed"
        );
        void child.flush?.();
      });

      next();
    });
  };
}
