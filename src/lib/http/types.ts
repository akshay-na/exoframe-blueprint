export interface Envelope<T = unknown> {
  ok: boolean;
  message: string;
  data: T | null;
}

export type MappingToken =
  | "$body"
  | `$params.${string}`
  | `$query.${string}`
  | `$header.${string}`;
