'use client';
import * as React from 'react';
import { UserAvatar } from './UserAvatar';
import { Comment, CommentVote } from '@prisma/client';
import { formatTimeToNow } from '@/lib/utils';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import { useUser } from '@clerk/nextjs';
import CommentVotes from './CommentVotes';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import { createSubredditComment } from '@/app/_actions/subreddit';

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: string;
};

interface PostCommentProps {
  comment: ExtendedComment;
  currentVote?: CommentVote | undefined;
  votesAmt: number;
  postId: string;
}

const PostComment: React.FC<PostCommentProps> = ({
  comment,
  currentVote,
  postId,
  votesAmt,
}) => {
  const commentRef = React.useRef<HTMLDivElement>(null);
  const [isReplying, setIsReplying] = React.useState<boolean>(false);
  const [input, setInput] = React.useState<string>('');
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();
  useOnClickOutside(commentRef, () => {
    setIsReplying(false);
  });

  const handleSubmit = () => {
    try {
      startTransition(async () => {
        const data = await createSubredditComment(
          postId,
          input,
          comment.replyToId || comment.id
        );
        toast({
          title: 'Reply posted',
          description: 'Your reply has been posted',
        });

        if (data?.error401) {
          toast({
            title: 'Unauthorized',
            description: 'You must be logged in to post a comment',
          });
        }
        setInput('');
        setIsReplying(false);
        router.refresh();
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while posting your comment',
      });
    }
  };

  return (
    <div className='flex flex-col' ref={commentRef}>
      <div className='flex items-center'>
        <UserAvatar
          user={{
            firstName: comment.author || 'Unknown',
            imageUrl: comment.authorImage,
          }}
        />

        <div className='ml-2 flex items-center gap-x-2'>
          <p className='text-sm font-medium'>{comment.author || 'Unknown'}</p>

          <p className='max-h-40 truncate text-xs'>
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <p className='text-sm mt-2 '>{comment.text}</p>

      <div className='flex gap-2 items-center'>
        <CommentVotes
          commentId={comment.id}
          votesAmt={votesAmt}
          currentVote={currentVote}
        />

        <Button
          onClick={() => {
            if (!user) return router.push('/sign-in');
            setIsReplying(true);
          }}
          variant='ghost'
          size='sm'
        >
          <MessageSquare className='h-4 w-4 mr-1.5' />
          Reply
        </Button>
      </div>

      {isReplying ? (
        <div className='grid w-full gap-1.5'>
          <Label htmlFor='comment'>Your comment</Label>
          <div className='mt-2'>
            <Textarea
              onFocus={e =>
                e.currentTarget.setSelectionRange(
                  e.currentTarget.value.length,
                  e.currentTarget.value.length
                )
              }
              autoFocus
              id='comment'
              value={input}
              onChange={e => setInput(e.target.value)}
              rows={1}
              placeholder='What are your thoughts?'
            />

            <div className='mt-2 flex justify-end gap-2'>
              <Button
                tabIndex={-1}
                variant='subtle'
                onClick={() => setIsReplying(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={isPending}
                onClick={() => {
                  if (!input) return;
                  handleSubmit();
                }}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PostComment;
