'use client';
import * as React from 'react';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Subreddit } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { CommandGroup } from 'cmdk';
import { usePathname, useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import useDebounce from '@/hooks/use-debounce';

const SearchBar = () => {
  const [input, setInput] = React.useState<string>('');
  const router = useRouter();
  const pathname = usePathname();
  const commandRef = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(commandRef, () => {
    setInput('');
  });

  const debouncedInput = useDebounce(input, 300);

  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryKey: ['search'],
    enabled: false,
    queryFn: async () => {
      if (!input) return [];
      const { data } = await axios.get(`/api/search?q=${input}`);
      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType;
      })[];
    },
  });

  React.useEffect(() => {
    setInput('');
  }, [pathname]);

  React.useEffect(() => {
    if (debouncedInput.length > 0) {
      refetch();
    }

    //cleanup
    return () => {
      refetch();
    };
  }, [debouncedInput]);

  return (
    <Command
      ref={commandRef}
      className='relative rounded-lg border max-w-lg z-50 overflow-visible'
    >
      <CommandInput
        onValueChange={text => {
          setInput(text);
        }}
        value={input}
        className='outline-none border-none focus:border-none focus:outline-none ring-0'
        placeholder='Search communities...'
      />

      {input.length > 0 && (
        <CommandList className='absolute bg-primary-foreground top-full inset-x-0 shadow rounded-b-md'>
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading='Communities' className='p-2'>
              {queryResults?.map(subreddit => (
                <CommandItem
                  onSelect={e => {
                    router.push(`/r/${e}`);
                    router.refresh();
                  }}
                  key={subreddit.id}
                  value={subreddit.name}
                >
                  <Users className='mr-2 h-4 w-4' />
                  <a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      )}
    </Command>
  );
};

export default SearchBar;
