'use client';
import * as React from 'react';
import { Button } from '../ui/button';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { voteToPostAction } from '@/app/_actions/posts';
import { useRouter } from 'next/navigation';
import { Vote, VoteType } from '@prisma/client';
import { usePrevious } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import { PostVoteRequest } from '@/lib/validation';
import axios, { AxiosError } from 'axios';
import { useToast } from '../ui/use-toast';
import { useAuth } from '@clerk/nextjs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PostVoteClientProps {
  postId: string;
  initialVotesAmt: number;
  initialVote?: VoteType | null;
}

const PostVoteClient: React.FC<PostVoteClientProps> = ({
  postId,
  initialVotesAmt,
  initialVote,
}) => {
  const { toast } = useToast();
  const [votesAmt, setVotesAmt] = React.useState(initialVotesAmt);
  const [currentVote, setCurrentVote] = React.useState(initialVote);
  const prevVote = usePrevious(currentVote);
  const { userId } = useAuth();

  const router = useRouter();

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: PostVoteRequest = {
        voteType: type,
        postId: postId,
      };

      await axios.patch('/api/subreddit/post/vote', payload);
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

    onMutate: (type: VoteType) => {
      if (currentVote === type) {
        // User is voting the same way again, so remove their vote
        setCurrentVote(undefined);
        if (type === 'UP') setVotesAmt(prev => prev - 1);
        else if (type === 'DOWN') setVotesAmt(prev => prev + 1);
      } else {
        // User is voting in the opposite direction, so subtract 2
        setCurrentVote(type);
        if (type === 'UP') setVotesAmt(prev => prev + (currentVote ? 2 : 1));
        else if (type === 'DOWN')
          setVotesAmt(prev => prev - (currentVote ? 2 : 1));
      }
    },
  });

  // ensure sync with server
  React.useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  return (
    <div className='flex flex-col gap-4 sm:gap-0 mr-6 sm:w-20 pb-4 sm:pb-0 bg-secondary'>
      {/* upvote */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => userId && vote('UP')}
            size='sm'
            variant='outline'
            aria-label='upvote'
          >
            <ArrowBigUp
              className={cn('h-5 w-5 text-zinc-700', {
                'text-emerald-500 fill-emerald-500': currentVote === 'UP',
              })}
            />
          </Button>
        </TooltipTrigger>
        {!userId && <TooltipContent>{<p>Login to vote</p>}</TooltipContent>}
      </Tooltip>

      {/* score */}
      <p className='text-center py-2 font-medium text-sm '>{votesAmt}</p>

      {/* downvote */}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => userId && vote('DOWN')}
            size='sm'
            className={cn({
              'text-emerald-500': currentVote === 'DOWN',
            })}
            variant='outline'
            aria-label='downvote'
            // disabled={!userId}
          >
            <ArrowBigDown
              className={cn('h-5 w-5 text-zinc-700', {
                'text-red-500 fill-red-500': currentVote === 'DOWN',
              })}
            />
          </Button>
        </TooltipTrigger>
        {!userId && <TooltipContent>{<p>Login to vote</p>}</TooltipContent>}
      </Tooltip>
    </div>
  );
};

export default PostVoteClient;
