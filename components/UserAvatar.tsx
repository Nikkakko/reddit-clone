import { User } from '@clerk/nextjs/server';
import { AvatarProps } from '@radix-ui/react-avatar';
import { Icons } from '@/components/Icons';
import Image from 'next/image';
import { Avatar, AvatarFallback } from './ui/avatar';

interface UserAvatarProps extends AvatarProps {
  user: {
    imageUrl: string;
    firstName: string;
  };
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user?.imageUrl ? (
        <div className='relative aspect-square h-full w-full'>
          <Image
            fill
            src={user.imageUrl}
            alt='profile picture'
            referrerPolicy='no-referrer'
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className='sr-only'>{user?.firstName}</span>
          <Icons.user className='h-4 w-4' />
        </AvatarFallback>
      )}
    </Avatar>
  );
}
