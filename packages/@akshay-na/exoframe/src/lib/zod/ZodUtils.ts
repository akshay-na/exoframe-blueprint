// ZodUtils.ts
// Utilities that are useful for Zod validation across the app

import { z, ZodError, ZodIssue, ZodSchema } from "zod";
import { RuntimeError } from "../common/RuntimeError";
export { z };

export class ZodUtils {
  public static parse<T>(
    schema: ZodSchema<T>,
    data: unknown
  ): T | RuntimeError {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors
          .map((e: ZodIssue) => {
            const path = e.path.length > 0 ? `${e.path.join(" -> ")}` : "";
            return `${path}: ${e.message}`;
          })
          .join(", ");

        throw new RuntimeError("VALIDATION_FAILED", { errorMessage });
      }

      throw error;
    }
  }

  public static safeParse<T>(schema: ZodSchema<T>, data: unknown) {
    try {
      return schema.safeParse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors
          .map((e: ZodIssue) => {
            const path = e.path.length > 0 ? `${e.path.join(" -> ")}` : "";
            return `${path}: ${e.message}`;
          })
          .join(", ");

        throw new RuntimeError("VALIDATION_FAILED", { errorMessage });
      }

      throw error;
    }
  }
}
