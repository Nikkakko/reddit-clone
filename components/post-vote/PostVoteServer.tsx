import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs';
import * as React from 'react';
import PostVoteClient from './PostVoteClient';

interface PostVoteServerProps {
  postId: string;
  initialVotesAmt: number;
  initialVote?: 'UP' | 'DOWN';
  subredditName: string;
}

const PostVoteServer: React.FC<PostVoteServerProps> = async ({
  postId,
  initialVotesAmt,
  initialVote,
  subredditName,
}) => {
  const user = await currentUser();

  const postVotes = await db.vote.findMany({
    where: {
      postId,
    },
  });

  const votesAmt = postVotes.reduce((acc, vote) => {
    if (vote.type === 'UP') return acc + 1;
    if (vote.type === 'DOWN') return acc - 1;
    return acc;
  }, 0);

  const currentVote = postVotes.find(vote => vote.userId === user?.id);

  return (
    <div>
      <PostVoteClient
        postId={postId}
        initialVotesAmt={votesAmt}
        initialVote={currentVote?.type}
        subredditName={subredditName}
      />
    </div>
  );
};

export default PostVoteServer;
