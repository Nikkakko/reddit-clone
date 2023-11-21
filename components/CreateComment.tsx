'use client';
import * as React from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useRouter } from 'next/navigation';
import { createSubredditComment } from '@/app/_actions/subreddit';
import { useToast } from './ui/use-toast';

interface CreateCommentProps {
  postId: string;
  replyToId?: string;
}

const CreateComment: React.FC<CreateCommentProps> = ({ postId, replyToId }) => {
  const [input, setInput] = React.useState<string>('');
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = () => {
    try {
      startTransition(async () => {
        const data = await createSubredditComment(postId, input, replyToId);
        toast({
          title: 'Comment posted',
          description: 'Your comment has been posted',
        });

        if (data?.error401) {
          toast({
            title: 'Unauthorized',
            description: 'You must be logged in to post a comment',
          });
        }
        setInput('');
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
    <div className='grid w-full gap-1.5'>
      <Label htmlFor='comment'>Your comment</Label>
      <div className='mt-2'>
        <Textarea
          id='comment'
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={1}
          className='resize-none'
          placeholder='What are your thoughts?'
        />

        <div className='mt-2 flex justify-end'>
          <Button
            disabled={input.length === 0 || isPending}
            onClick={handleSubmit}
            variant='default'
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
