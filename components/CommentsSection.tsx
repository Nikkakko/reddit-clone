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

const CommentsSection = async ({ postId }: CommentsSectionProps) => {
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

                {/* Render replies */}

                {topLevelComment.replies
                  .sort((a, b) => b.votes.length - a.votes.length)
                  .map(reply => {
                    const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                      if (vote.type === 'UP') return acc + 1;
                      if (vote.type === 'DOWN') return acc - 1;
                      return acc;
                    }, 0);

                    const replyVote = reply.votes.find(
                      vote => vote.userId === user?.id
                    );

                    return (
                      <div
                        key={reply.id}
                        className='ml-2 py-2 pl-4 border-l-2 border-zinc-200'
                      >
                        <PostComment
                          comment={reply}
                          currentVote={replyVote}
                          votesAmt={replyVotesAmt}
                          postId={postId}
                        />
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentsSection;
