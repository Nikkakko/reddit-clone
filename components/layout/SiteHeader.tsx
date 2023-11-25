'use client';
import {
  UserButton,
  SignInButton,
  currentUser,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';
import * as React from 'react';
import { Button } from '../ui/button';
import { ThemeToggle } from './theme-toggle';
import Link from 'next/link';
import SearchBar from '../SearchBar';

interface SiteHeaderProps {}

const SiteHeader: React.FC<SiteHeaderProps> = () => {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background py-2'>
      <div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
        <Link href='/' className='flex gap-2 items-center'>
          {/* <Icons.logo className='h-8 w-8 sm:h-6 sm:w-6' /> */}
          <p className='hidden  text-sm font-medium md:block'>Redbit</p>
        </Link>

        <SearchBar />

        <div className='flex items-center space-x-2'>
          <SignedIn>
            <UserButton afterSignOutUrl='/' />
          </SignedIn>
          <SignedOut>
            <Link href='/signup'>
              <Button variant='outline'>Sign in</Button>
            </Link>
          </SignedOut>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
