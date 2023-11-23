import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/lib/config';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs';
import { notFound } from 'next/navigation';
import * as React from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import SubscribeLeaveToggle from '@/components/SubscribeLeaveToggle';
import ToFeedButton from '@/components/ToFeedButton.';

interface SlugLayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

const SlugLayout: React.FC<SlugLayoutProps> = async ({
  children,
  params: { slug },
}) => {
  const user = await currentUser();
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          votes: true,
        },
      },
    },

    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });

  const subscription = !user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subreddit: {
            name: slug,
          },

          userId: user.id,
        },
      });

  const isSubscribed = !!subscription;

  if (!subreddit) return notFound();

  const memberCount = await db.subscription.count({
    where: {
      subreddit: {
        name: slug,
      },
    },
  });
  return (
    <div className='sm:container max-w-7xl mx-auto h-full pt-12'>
      <div>
        {/* TODO:button to take us back */}
        <ToFeedButton />

        <div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
          <ul className='flex flex-col col-span-2 space-y-6'>{children}</ul>

          {/* Info sidebar */}

          <div className='overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last'>
            <div className='px-6 py-4'>
              <p className='font-semibold py-3'>About r/{subreddit.name}</p>
            </div>

            <dl className='divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white'>
              <div className='flex justify-between gap-x-4 py-3'>
                <dt className='text-gray-500'>Created</dt>
                <dd className='text-gray-700'>
                  <time dateTime={subreddit.createdAt.toDateString()}>
                    {format(subreddit.createdAt, 'MMMM d, yyyy')}
                  </time>
                </dd>
              </div>
              <div className='flex justify-between gap-x-4 py-3'>
                <dt className='text-gray-500'>Members</dt>
                <dd className='flex items-start gap-x-2'>
                  <div className='text-gray-900'>{memberCount}</div>
                </dd>
              </div>
              {subreddit.creatorId === user?.id ? (
                <div className='flex justify-between gap-x-4 py-3'>
                  <dt className='text-gray-500'>You created this community</dt>
                </div>
              ) : null}

              {subreddit.creatorId !== user?.id ? (
                <SubscribeLeaveToggle
                  isSubscribed={isSubscribed}
                  subredditId={subreddit.id}
                  subredditName={subreddit.name}
                />
              ) : null}
              <Link
                className={buttonVariants({
                  variant: 'outline',
                  className: 'w-full mb-6',
                })}
                href={`r/${slug}/submit`}
              >
                Create Post
              </Link>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlugLayout;
