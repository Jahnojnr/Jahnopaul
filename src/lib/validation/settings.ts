import { z } from "zod";
import { optionalUrlSchema } from "@/lib/validation/common";

export const profileSettingsSchema = z.object({
  fullName: z.string().trim().min(1, "A name is required.").max(120),
  headline: z.string().trim().min(1, "A headline is required.").max(160),
  bio: z.string().trim().max(600, "Keep the short bio under 600 characters."),
  longBio: z.string().max(6000, "Keep the longer biography under 6000 characters."),
  location: z.string().trim().max(120),
  avatarPath: z.string().trim().max(300),
  resumePath: z.string().trim().max(300),
  githubUrl: optionalUrlSchema,
  defaultDescription: z
    .string()
    .trim()
    .max(300, "Keep the default description under 300 characters."),
});

export type ProfileSettingsInput = z.infer<typeof profileSettingsSchema>;
