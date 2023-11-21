'use client';
import * as React from 'react';

import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { voteToPostAction } from '@/app/_actions/posts';
import { useRouter } from 'next/navigation';
import { CommentVote, Vote, VoteType } from '@prisma/client';
import { usePrevious } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import { PostVoteRequest } from '@/lib/validation';
import axios, { AxiosError } from 'axios';
import { useToast } from './ui/use-toast';
import { Button } from './ui/button';
import { voteOnCommentAction } from '@/app/_actions/subreddit';

type PartialVote = Pick<CommentVote, 'type'>;

interface CommentVoteProps {
  commentId: string;
  votesAmt: number;
  currentVote?: PartialVote;
}

const CommentVotes: React.FC<CommentVoteProps> = ({
  commentId,
  votesAmt: _votesAmt,
  currentVote: _currentVote,
}) => {
  const { toast } = useToast();
  const [votesAmt, setVotesAmt] = React.useState<number>(_votesAmt);
  const [currentVote, setCurrentVote] = React.useState<PartialVote | undefined>(
    _currentVote
  );
  const prevVote = usePrevious(currentVote);

  const router = useRouter();

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      await voteOnCommentAction(commentId, type);
    },

    onError: (err, voteType) => {
      if (voteType === 'UP') setVotesAmt(prev => prev - 1);
      else setVotesAmt(prev => prev + 1);

      // reset current vote
      setCurrentVote(prevVote);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast({
            title: 'You must be logged in to vote',
            description: 'Please login to vote',
            onClick: () => router.push('/sign-in'),
          });
        }
      }

      toast({
        title: 'An error occurred',
        description: 'Please try again',
      });
    },

    onMutate: type => {
      if (currentVote?.type === type) {
        // User is voting the same way again, so remove their vote
        setCurrentVote(undefined);
        if (type === 'UP') setVotesAmt(prev => prev - 1);
        else if (type === 'DOWN') setVotesAmt(prev => prev + 1);
      } else {
        // User is voting in the opposite direction, so subtract 2
        setCurrentVote({ type });
        if (type === 'UP') setVotesAmt(prev => prev + (currentVote ? 2 : 1));
        else if (type === 'DOWN')
          setVotesAmt(prev => prev - (currentVote ? 2 : 1));
      }
    },
  });

  return (
    <div className='flex gap-1'>
      {/* upvote */}
      <Button
        onClick={() => vote('UP')}
        size='sm'
        variant='ghost'
        aria-label='upvote'
      >
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700', {
            'text-emerald-500 fill-emerald-500': currentVote?.type === 'UP',
          })}
        />
      </Button>

      {/* score */}
      <p className='text-center py-2 font-medium text-sm '>{votesAmt}</p>

      {/* downvote */}
      <Button
        onClick={() => vote('DOWN')}
        size='sm'
        className={cn({
          'text-emerald-500': currentVote?.type === 'DOWN',
        })}
        variant='ghost'
        aria-label='downvote'
      >
        <ArrowBigDown
          className={cn('h-5 w-5 text-zinc-700', {
            'text-red-500 fill-red-500': currentVote?.type === 'DOWN',
          })}
        />
      </Button>
    </div>
  );
};

export default CommentVotes;
