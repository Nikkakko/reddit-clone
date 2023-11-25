import * as React from 'react';
import PostFeed from './PostFeed';
import { currentUser } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/lib/config';

const CustomFeed = async () => {
  const user = await currentUser();

  if (!user) return notFound();

  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: user.id,
      subreddit: {
        NOT: {
          id: undefined,
        },
      },
    },

    include: {
      subreddit: true,
    },
  });

  const posts = await db.post.findMany({
    where: {
      subreddit: {
        name: {
          in: followedCommunities.map(sub => sub.subreddit.name),
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },

    include: {
      votes: true,
      comments: true,
      subreddit: true,
    },

    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });

  if (!posts) return <div>There are no posts to show.</div>;

  return <PostFeed initialPosts={posts} />;
};

export default CustomFeed;
