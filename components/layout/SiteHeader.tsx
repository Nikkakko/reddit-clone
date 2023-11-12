import { UserButton, SignInButton } from '@clerk/nextjs';
import { User } from '@clerk/nextjs/server';
import Image from 'next/image';
import * as React from 'react';
import { Button } from '../ui/button';
import { getUserEmail } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import Link from 'next/link';

interface SiteHeaderProps {
  user: User | null;
}

const SiteHeader: React.FC<SiteHeaderProps> = ({ user }) => {
  const initials = `${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`;

  const email = getUserEmail(user);

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background py-2'>
      <div className='container flex h-16 items-center justify-between'>
        <Link href='/' className='flex gap-2 items-center'>
          {/* <Icons.logo className='h-8 w-8 sm:h-6 sm:w-6' /> */}
          <p className='hidden  text-sm font-medium md:block'>Redbit</p>
        </Link>

        <div>SearchBar</div>

        <div className='flex items-center space-x-2'>
          {user ? (
            <UserButton afterSignOutUrl='/' />
          ) : (
            <Button asChild variant='outline' size='sm'>
              <SignInButton />
            </Button>
          )}
          {user && <span className=''>{initials}</span>}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
