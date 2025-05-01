import { z } from "@akshay-na/exoframe/lib/zod/ZodUtils";

const locationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
});

export const userSchema = z.object({
  id: z.string(),
  age: z.number().min(0),
  gender: z.enum(["M", "F", "Other"]),
  location: locationSchema,
  interests: z.array(z.string()),
});

export type UserData = z.infer<typeof userSchema>;
