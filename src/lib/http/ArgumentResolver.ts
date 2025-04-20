import { Request } from "express";

export function resolveArguments(tokens: string[], req: Request): any[] {
  return tokens.map((token) => {
    if (token === "$body") return req.body;
    if (token.startsWith("$params.")) return req.params[token.slice(8)];
    if (token.startsWith("$query.")) return req.query[token.slice(7)];
    if (token.startsWith("$header."))
      return req.headers[token.slice(8).toLowerCase()];
    throw new Error(`Unknown mapping token ${token}`);
  });
}
