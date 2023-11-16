'use client';
import * as React from 'react';
import { useToast } from './ui/use-toast';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { subscribeAction, unsubscribeAction } from '@/app/_actions/subreddit';
import { Loader2Icon } from 'lucide-react';

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
    const showToast = (
      title: string | undefined,
      description: string | undefined,
      isError?: boolean
    ) => {
      toast({
        title,
        description,
        variant: isError ? 'destructive' : 'default',
      });
    };

    startTransition(async () => {
      let data;
      if (!isSubscribed) {
        data = await subscribeAction(subredditId);
      } else {
        data = await unsubscribeAction(subredditId);
      }

      if (data.success) {
        const action = isSubscribed ? 'Unsubscribed' : 'Subscribed';
        showToast(
          action,
          `You have ${action.toLowerCase()} from ${subredditName}.`,
          false
        );
        router.refresh();
      } else if (data.error400 || data.error401 || data.error500) {
        showToast(
          data.error400?.title || data.error401?.title || data.error500?.title,
          data.error400?.message ||
            data.error401?.message ||
            data.error500?.message,
          true
        );
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
      {isPending && <Loader2Icon className='animate-spin mr-2' />}
      {isSubscribed ? 'Leave community' : 'Join to post'}
    </Button>
  );
};

export default SubscribeLeaveToggle;
