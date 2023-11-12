import MiniCreatePost from '@/components/MiniCreatePost';
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

const SlugPage: React.FC<Props> = async ({ params: { slug } }) => {
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
      },
    },

    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });

  if (!subreddit) return notFound();
  return (
    <>
      <h1 className='font-bold text-3xl md:text-4xl h-14'>
        r/{subreddit.name}
      </h1>
      <MiniCreatePost user={JSON.parse(JSON.stringify(user))} />
      {/* TODO: Show posts in user feed */}
    </>
  );
};

export default SlugPage;
