import { z } from "zod";

const MediaSchema = z.object({
  bucket: z.string(),
  height: z.number(),
  width: z.number(),
  path: z.string(),
  mediaType: z.string(),
  mimeType: z.string(),
});

export const PostSchema = z.object({
  primary: MediaSchema,
  secondary: MediaSchema,
  retakeCounter: z.number(),
  visibility: z.array(z.string()),
  takenAt: z.string(),
});

export const PostsSchema = z.array(PostSchema);

export type Post = z.infer<typeof PostSchema>;
