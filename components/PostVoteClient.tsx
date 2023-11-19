import * as React from 'react';

interface PostVoteClientProps {
  postId: string;
  initialVotesAmt: number;
  initialVote?: 'UP' | 'DOWN';
}

const PostVoteClient: React.FC<PostVoteClientProps> = ({}) => {
  return (
    <div className='flex flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0'>
      P
    </div>
  );
};

export default PostVoteClient;
