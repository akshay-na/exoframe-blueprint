import { Request, Response } from "express";
import { Envelope } from "./types";

export function sendEnvelope(
  req: Request,
  res: Response,
  status: number,
  payload: unknown
): void {
  const ok = status >= 200 && status < 300;
  const msgBase = ok ? "SUCCESS" : "FAILED";
  const message = `${msgBase}(${req.baseUrl}${req.route?.path ?? ""})`;

  const body: Envelope = { ok, message, data: payload ?? null };
  res.status(status).json(body);
}
