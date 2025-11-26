import { z } from "zod";

// Email signup validation
export const emailSignupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please fill a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().optional(),
  avatar: z.string().optional(),
});

export type EmailSignupPayload = z.infer<typeof emailSignupSchema>;

// Email login validation
export const emailLoginSchema = z.object({
  email: z.string().email("Please fill a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type EmailLoginPayload = z.infer<typeof emailLoginSchema>;

// OAuth signup validation
export const oauthSignupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please fill a valid email address"),
  avatar: z.string().optional(),
  oauthId: z.string().min(1, "OAuth ID is required"),
  provider: z.enum(["google", "github"]),
});

export type OAuthSignupPayload = z.infer<typeof oauthSignupSchema>;

// OAuth login validation
export const oauthLoginSchema = z.object({
  email: z.string().email("Please fill a valid email address"),
  oauthId: z.string().min(1, "OAuth ID is required"),
  provider: z.enum(["google", "github"]),
});

export type OAuthLoginPayload = z.infer<typeof oauthLoginSchema>;
