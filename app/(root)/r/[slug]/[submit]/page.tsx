import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import * as React from 'react';

import CreatePostTabs from '@/components/CreatePostTabs';

interface SubmitPageProps {
  params: {
    slug: string;
  };
}

export default async function SubmitPage({ params }: SubmitPageProps) {
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: params.slug,
    },
  });

  if (!subreddit) return notFound();

  return (
    <div className='flex flex-col items-start gap-6'>
      {/* Heading */}
      <div className='border-b border-gray-200 pb-5 '>
        <div className='-ml-2 -mt-2 flex flex-wrap items-baseline'>
          <h3 className='ml-2 mt-2 text-base font-semibold leading-6'>
            Create Post
          </h3>
          <p className='ml-2 mt-1 truncate text-sm text-muted-foreground'>
            in r/{params.slug}
          </p>
        </div>
      </div>

      {/* Form */}
      <CreatePostTabs subredditId={subreddit.id} />
    </div>
  );
}
