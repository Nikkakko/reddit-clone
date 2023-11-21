import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs';
import { Comment, CommentVote } from '@prisma/client';
import * as React from 'react';
import PostComment from './PostComment';
import CreateComment from './CreateComment';
import { getUserById } from '@/lib/utils';

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: string;
  replies: ReplyComment[];
};

type ReplyComment = Comment & {
  votes: CommentVote[];
  author: string;
};

interface CommentsSectionProps {
  postId: string;
  comments?: ExtendedComment[];
}

const CommentsSection: React.FC<CommentsSectionProps> = async ({ postId }) => {
  const user = await currentUser();

  const comments = await db.comment.findMany({
    where: {
      postId: postId,
      replyToId: undefined, // only fetch top-level comments
    },
    include: {
      votes: true,
      replies: {
        // first level replies
        include: {
          votes: true,
        },
      },
    },
  });

  return (
    <div className='flex flex-col gap-y-4 mt-4'>
      <hr className='w-full h-px my-6' />

      {/* TODO: CReate component */}
      <CreateComment postId={postId} />
      <div className='flex flex-col gap-y-6 mt-4'>
        {comments
          .filter(comment => !comment.replyToId)
          .map(topLevelComment => {
            const topLevelCOmmentVotesAtm = topLevelComment.votes.reduce(
              (acc, vote) => {
                if (vote.type === 'UP') return acc + 1;
                if (vote.type === 'DOWN') return acc - 1;
                return acc;
              },
              0
            );

            const topLevelCommentVote = topLevelComment.votes.find(
              vote => vote.userId === user?.id
            );

            return (
              <div key={topLevelComment.id} className='flex flex-col'>
                <div className='mb-2'>
                  <PostComment
                    comment={topLevelComment}
                    currentVote={topLevelCommentVote}
                    votesAmt={topLevelCOmmentVotesAtm}
                    postId={postId}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentsSection;
