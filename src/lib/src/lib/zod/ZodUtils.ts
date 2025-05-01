// ZodUtils.ts
// Utilities that are useful for Zod validation across the app

import { z as zod, ZodSchema } from "zod";

// Export schema builder API via this proxy
export const z = {
  string: zod.string,
  number: zod.number,
  object: zod.object,
  array: zod.array,
  enum: zod.enum,
  getType: <T extends ZodSchema<any>>(schema: T): zod.infer<T> => null as any,
};

export class ZodUtils {
  public static parse<T>(schema: ZodSchema<T>, data: unknown): T {
    return schema.parse(data);
  }

  public static safeParse<T>(schema: ZodSchema<T>, data: unknown) {
    return schema.safeParse(data);
  }

  public static createValidator<T>(schema: ZodSchema<T>) {
    return {
      parse: (data: unknown) => ZodUtils.parse(schema, data),
      safeParse: (data: unknown) => ZodUtils.safeParse(schema, data),
    };
  }
}
