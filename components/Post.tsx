'use client';
import { formatTimeToNow, getUserById } from '@/lib/utils';
import { ExtendedPost } from '@/types/db';
import { clerkClient } from '@clerk/nextjs';
import { User } from '@clerk/nextjs/server';
import { Post, Vote } from '@prisma/client';
import Link from 'next/link';
// import { Post } from '@prisma/client';
import * as React from 'react';
import PostVoteClient from './post-vote/PostVoteClient';
import { MessageSquare } from 'lucide-react';
import EditorOutput from './EditorOutput';
import PostVoteServer from './post-vote/PostVoteServer';

type PartialVote = Pick<Vote, 'type'>;

interface PostProps {
  post: Post & {
    author: string;
    votes: Vote[];
  };
  votesAmt: number;
  subredditName: string;
  currentVote?: PartialVote;
  commentAmt: number;
  postsWithTotalVotes?: ExtendedPost[];
}

const Post: React.FC<PostProps> = ({
  post,
  votesAmt,
  subredditName,
  currentVote,
  commentAmt,
}) => {
  const pRef = React.useRef<HTMLParagraphElement>(null);

  return (
    <div className='rounded-md shadow bg-primary-foreground'>
      <div className='px-6 py-4 flex justify-between'>
        <PostVoteClient
          postId={post.id}
          initialVotesAmt={votesAmt}
          initialVote={currentVote?.type}
          subredditName={subredditName}
        />

        <div className='w-0 flex-1 bg-primary p-2'>
          <div className='max-h-40 mt-1 text-xs text-background'>
            {subredditName ? (
              <>
                <a
                  className='underline text-sm underline-offset-2'
                  href={`/r/${subredditName}`}
                >
                  r/{subredditName}
                </a>
                <span className='px-1'>•</span>
              </>
            ) : null}
            <span>Posted by u/{post.author}</span>{' '}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className='text-lg font-semibold py-2 leading-6 text-background'>
              {post.title}
            </h1>
          </a>

          <div
            className='relative text-sm max-h-40 w-full overflow-clip'
            ref={pRef}
          >
            {/* <EditorOutput content={post.content} /> */}

            {pRef.current?.clientHeight === 160 ? (
              // blur bottom if content is too long
              <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent'></div>
            ) : null}
          </div>
        </div>
      </div>

      <div className='bg-secondary z-20 text-sm px-4 py-4 sm:px-6'>
        <Link
          href={`/r/${subredditName}/post/${post.id}`}
          className='w-fit flex items-center gap-2'
        >
          <MessageSquare className='h-4 w-4' /> {commentAmt} comments
        </Link>
      </div>
    </div>
  );
};

export default Post;
