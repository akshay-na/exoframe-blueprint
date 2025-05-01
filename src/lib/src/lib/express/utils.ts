import { NextFunction, Request, Response } from "express";

export function resolveToken(token: string, req: Request): unknown {
  switch (token) {
    case "$body":
      return req.body;
    case "$query":
      return req.query;
    case "$params":
      return req.params;
    case "$headers":
      return req.headers;
    default:
      return undefined;
  }
}

export function applyGuards(config: ConfigurationOptions) {
  /*
   * In a real implementation this would delegate to composable middleware
   * objects provided at composition‑root time – e.g., AuthGuard, RightsGuard.
   * Here we stub out a PASS‑THROUGH to keep the library light.
   */
  return (req: Request, res: Response, next: NextFunction) => {
    // Example: JWT guard
    if (config.auth === "JWT" && !req.headers.authorization) {
      return res.status(401).json({ error: "NOT_AUTHORIZED" });
    }
    return next();
  };
}
