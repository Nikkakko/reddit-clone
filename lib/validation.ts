import * as z from 'zod';

export const formSchema = z.object({
  input: z
    .string()
    .min(1, {
      message: 'Community name must be at least 1 character long',
    })
    .max(255),
});

export const subredditSubscriptionValidator = z.object({
  subredditId: z.string(),
});

export type SubscibeToSubredditPayload = z.infer<
  typeof subredditSubscriptionValidator
>;

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, {
      message: 'Title must be at least 3 characters long',
    })
    .max(128, {
      message: 'Title must be less than 128 characters long',
    }),
  subredditId: z.string(),
  content: z.any(),
});

export type PostCreationRequest = z.infer<typeof PostValidator>;

export const PostVoteValidator = z.object({
  postId: z.string(),
  voteType: z.enum(['UP', 'DOWN']),
});

export type PostVoteRequest = z.infer<typeof PostVoteValidator>;

export const CommentVoteValidator = z.object({
  commentId: z.string(),
  voteType: z.enum(['UP', 'DOWN']),
});

export type CommentVoteRequest = z.infer<typeof CommentVoteValidator>;
