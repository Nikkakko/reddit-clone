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
    where: { name: slug },
    include: {
      posts: {
        include: {
          votes: true,
          comments: true,
          subreddit: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
      },
    },
  });

  if (!subreddit) return notFound();

  
  return (
    <>
      <h1 className='font-bold text-3xl md:text-4xl h-14'>
        r/{subreddit.name}
      </h1>
      <MiniCreatePost
        user={{
          firstName: user?.firstName || 'Anonymous',
          imageUrl: user?.imageUrl || '',
        }}
      />
      {/* TODO: Show posts in user feed */}
      <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} />
    </>
  );
}
