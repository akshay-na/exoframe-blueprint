export interface Envelope<T = unknown> {
  ok: boolean;
  message: string;
  data: T | null;
}
