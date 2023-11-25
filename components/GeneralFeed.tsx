import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/lib/config';
import { db } from '@/lib/db';
import * as React from 'react';
import PostFeed from './PostFeed';

const GeneralFeed = async () => {
  const posts = await db.post.findMany({
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

export default GeneralFeed;
