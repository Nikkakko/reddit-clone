import MiniCreatePost from '@/components/MiniCreatePost';
import PostFeed from '@/components/PostFeed';
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/lib/config';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs';
import { notFound } from 'next/navigation';
import * as React from 'react';

interface Props {
  params: {
    slug: string;
  };
}

export default async function SlugPage({ params: { slug } }: Props) {
  const user = await currentUser();

  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          votes: true,
          comments: true,
          subreddit: true,
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS, // Limit the number of posts fetched
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const initialPosts = await db.post.findMany({
    where: {
      subreddit: {
        name: slug,
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

  if (!subreddit) return notFound();
  return (
    <>
      <h1 className='font-bold text-3xl md:text-4xl h-14'>
        r/{subreddit.name}
      </h1>
      <MiniCreatePost
        user={{
          imageUrl: user?.imageUrl ?? '',
          firstName: user?.firstName ?? '',
        }}
      />
      {/* TODO: Show posts in user feed */}
      <PostFeed initialPosts={initialPosts} subredditName={subreddit.name} />
    </>
  );
}
