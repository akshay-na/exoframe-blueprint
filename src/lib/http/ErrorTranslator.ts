export function translateError(err: any, map: Record<string, number>): number {
  return map[err.code] ?? err.status ?? 500;
}
