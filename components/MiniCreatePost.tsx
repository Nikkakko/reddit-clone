'use client';
import { User } from '@clerk/nextjs/server';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { UserAvatar } from './UserAvatar';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ImageIcon, Link2 } from 'lucide-react';

interface MiniCreatePostProps {
  user: {
    firstName: string;
    imageUrl: string;
  };
}

const MiniCreatePost: React.FC<MiniCreatePostProps> = ({ user }) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <li
      className='overflow-hidden rounded-md bg-background shadow
      list-none
    '
    >
      <div className='h-full px-6 py-4 flex justify-between gap-6'>
        <div className='relative'>
          <UserAvatar
            user={{
              firstName: user.firstName,
              imageUrl: user.imageUrl,
            }}
          />

          <span className='absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-background' />
        </div>
        <Input
          readOnly
          onClick={() => router.push(pathname + '/submit')}
          placeholder='Create a post'
        />

        <Button
          onClick={() => router.push(pathname + '/submit')}
          variant='ghost'
        >
          <ImageIcon className='text-zinc-600' />
        </Button>
        <Button
          onClick={() => router.push(pathname + '/submit')}
          variant='ghost'
        >
          <Link2 className='text-zinc-600' />
        </Button>
      </div>
    </li>
  );
};

export default MiniCreatePost;
