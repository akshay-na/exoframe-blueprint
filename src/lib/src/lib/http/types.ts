export interface SuccessEnvelope<T = unknown> {
  ok: boolean;
  message: string;
  data: T | null;
}

export interface FailureEnvelope {
  ok: boolean;
  message: string;
  error: unknown | null;
}
