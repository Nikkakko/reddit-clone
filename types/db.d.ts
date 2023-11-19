import type { Post, Subreddit, Vote, Comment } from '@prisma/client';
import { User } from '@clerk/nextjs/server';

export type ExtendedPost = Post & {
  subreddit: Subreddit;
  votes: Vote[];
  author: string;
  comments: Comment[];
};
