import { z } from "zod";

export const ALLOWED_CITIES = ["New York", "Tel Aviv"] as const;

export const WeatherQuerySchema = z
  .object({
    start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    city: z.enum(ALLOWED_CITIES),
  })
  .refine(({ start, end }) => new Date(start) <= new Date(end), {
    message: "Start date must be before end date",
    path: ["start"],
  })
  .refine(({ end }) => new Date(end) <= new Date(), {
    message: "End date cannot be in the future",
    path: ["end"],
  });
