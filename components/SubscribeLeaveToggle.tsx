'use client';
import * as React from 'react';
import { useToast } from './ui/use-toast';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { subscribeAction, unsubscribeAction } from '@/app/_actions/subreddit';

interface SubscribeLeaveToggleProps {
  isSubscribed: boolean;
  subredditId: string;
  subredditName: string;
}

const SubscribeLeaveToggle: React.FC<SubscribeLeaveToggleProps> = ({
  isSubscribed,
  subredditId,
  subredditName,
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const handleSubscribe = async () => {
    startTransition(async () => {
      if (!isSubscribed) {
        const data = await subscribeAction(subredditId);
        if (data.success) {
          toast({
            title: 'Subscribed',
            description: `You have subscribed to ${subredditName}.`,
          });
          router.refresh();
        }
      } else {
        const data = await unsubscribeAction(subredditId);
        if (data.success) {
          toast({
            title: 'Unsubscribed',
            description: `You have unsubscribed from ${subredditName}.`,
          });
          router.refresh();
        }
      }
    });
  };

  return (
    <Button
      className='w-full mt-1 mb-4'
      disabled={isPending}
      variant={isSubscribed ? 'secondary' : 'default'}
      onClick={() => handleSubscribe()}
    >
      {isSubscribed ? 'Leave community' : 'Join to post'}
    </Button>
  );
};

export default SubscribeLeaveToggle;
