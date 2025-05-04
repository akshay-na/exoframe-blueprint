import { Request, Response } from "express";
import { FailureEnvelope, SuccessEnvelope } from "./types";

export function sendEnvelope(
  req: Request,
  res: Response,
  status: number,
  payload: any
): void {
  const ok = status >= 200 && status < 300;
  const msgBase = ok ? "SUCCESS" : "FAILED";
  const message = `${msgBase}(${req.baseUrl}${req.route?.path ?? ""})`;

  if (payload.error) {
    const body: FailureEnvelope = { ok, message, error: payload ?? null };
    res.status(status).json(body);
  } else {
    const body: SuccessEnvelope = { ok, message, data: payload ?? null };
    res.status(status).json(body);
  }
}
