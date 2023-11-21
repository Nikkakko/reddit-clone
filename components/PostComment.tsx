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
  const { user } = useUser();
  const router = useRouter();
  useOnClickOutside(commentRef, () => {
    setIsReplying(false);
  });

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

      <p className='text-sm mt-2'>{comment.text}</p>

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
    </div>
  );
};

export default PostComment;
