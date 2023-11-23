import CommentsSection from '@/components/CommentsSection';
import PostVoteServer from '@/components/post-vote/PostVoteServer';
import { buttonVariants } from '@/components/ui/button';
import { db } from '@/lib/db';
import { cn, formatTimeToNow } from '@/lib/utils';
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import * as React from 'react';

interface Props {
  params: {
    postId: string;
  };
}

export default async function PostDetailPage({ params: { postId } }: Props) {
  const post = await db.post.findFirst({
    where: {
      id: postId,
    },

    include: {
      votes: true,
    },
  });

  if (!post) {
    return notFound();
  }
  return (
    <div>
      <div className='h-full flex flex-col sm:flex-row items-center sm:items-start justify-between'>
        <React.Suspense fallback={<PostVoteShell />}>
          <PostVoteServer
            postId={post.id}
            getData={async () => {
              return await db.post.findUnique({
                where: {
                  id: postId,
                },

                include: {
                  votes: true,
                },
              });
            }}
            initialVotesAmt={post.votes.length}
            initialVote={post.votes[0]?.type}
          />
        </React.Suspense>

        <div className='sm:w-0 w-full flex-1 bg-primary-foreground p-4 rounded-sm'>
          <p className='max-h-40 mt-1 truncate text-xs'>
            Posted by u/{post?.author}{' '}
            {formatTimeToNow(new Date(post?.createdAt))}
          </p>
          <h1 className='text-xl font-semibold py-2 leading-6'>
            {post?.title}
          </h1>

          {/* <EditorOutput content={post?.content ?? cachedPost.content} /> */}
          <React.Suspense
            fallback={<Loader2 className='h-5 w-5 animate-spin ' />}
          >
            <CommentsSection postId={post?.id} />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}

function PostVoteShell() {
  return (
    <div className='flex items-center flex-col pr-6 w-20'>
      {/* upvote */}
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigUp className='h-5 w-5 text-zinc-700' />
      </div>

      {/* score */}
      <div className='text-center py-2 font-medium text-sm text-zinc-900'>
        <Loader2 className='h-3 w-3 animate-spin' />
      </div>

      {/* downvote */}
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigDown className='h-5 w-5 text-zinc-700' />
      </div>
    </div>
  );
}
