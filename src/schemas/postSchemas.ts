import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  body: z
    .string()
    .min(1, "Content is required")
    .min(10, "Content must be at least 10 characters")
    .max(1000, "Content must be less than 1000 characters"),
});

export const editPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  body: z
    .string()
    .min(1, "Content is required")
    .min(10, "Content must be at least 10 characters")
    .max(1000, "Content must be less than 1000 characters"),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;
export type EditPostFormData = z.infer<typeof editPostSchema>;
