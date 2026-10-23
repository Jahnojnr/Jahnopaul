import { z } from "zod";

/**
 * Contact form validation. The same schema is used by the browser for instant
 * feedback and by the Route Handler, which is the boundary that actually
 * matters: nothing is stored or emailed before it passes here.
 */

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(120, "Keep your name under 120 characters."),
  email: z
    .email("Enter a valid email address.")
    .max(200, "Keep your email address under 200 characters."),
  subject: z
    .string()
    .trim()
    .min(3, "Add a short subject.")
    .max(160, "Keep the subject under 160 characters."),
  message: z
    .string()
    .trim()
    .min(20, "Please write at least 20 characters.")
    .max(4000, "Keep the message under 4000 characters."),
  // Honeypot: real visitors never fill this in. A filled value is rejected
  // silently by the route handler.
  company: z.string().max(0).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
