'use client';
import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

import UploadUi from './UploadUi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PostCreationRequest, PostValidator } from '@/lib/validation';
import EditorComp from './Editor';
import { EditorContentProps } from '@tiptap/react';
import { createSubredditPost } from '@/app/_actions/subreddit';
import { useToast } from './ui/use-toast';
import { Button } from './ui/button';
import { Icons } from './Icons';

interface CreatePostTabsProps {
  subredditId: string;
}

type FormData = z.infer<typeof PostValidator>;

const CreatePostTabs: React.FC<CreatePostTabsProps> = ({ subredditId }) => {
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      title: '',
      content: null,
    },
  });

  const contentValue = getValues('content');

  async function onSubmit(data: FormData) {
    const payload: PostCreationRequest = {
      subredditId,
      title: data.title,
      content: data.content,
    };

    startTransition(async () => {
      try {
        const values = await createSubredditPost(
          payload.subredditId,
          payload.title,
          payload.content
        );
        if (values.error400) {
          toast({
            title: values.error400.title,
            description: values.error400.message,
          });
        } else if (values.error401) {
          toast({
            title: values.error401.title,
            description: values.error401.message,
          });
        } else if (values.error500) {
          toast({
            title: values.error500.title,
            description: values.error500.message,
          });
        }

        if (values.success) {
          toast({
            title: values.success.title,
            description: values.success.message,
          });
        }

        reset();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again later.',
        });
      }
    });
  }

  return (
    <form
      id='subreddit-post-form'
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-2 w-full'
    >
      <Tabs defaultValue='post' className='w-full'>
        <TabsList>
          <TabsTrigger value='post'>Post</TabsTrigger>
          <TabsTrigger value='upload-file'>Image & Video</TabsTrigger>
        </TabsList>
        <div className='mt-2'>
          <Input {...register('title')} placeholder='Title' />
          {errors.title && (
            <p className='text-sm text-red-500 mt-1'>{errors.title.message}</p>
          )}
        </div>

        <TabsContent value='post'>
          <EditorComp contentValue={contentValue} setValue={setValue} />
        </TabsContent>
        <TabsContent value='upload-file'>
          <UploadUi />
        </TabsContent>
      </Tabs>

      <div className='w-full flex justify-end'>
        <Button
          type='submit'
          className='w-full'
          form='subreddit-post-form'
          disabled={isPending}
        >
          {isPending && <Icons.loader className='w-4 h-4 animate-spin' />}
          Post
        </Button>
      </div>
    </form>
  );
};

export default CreatePostTabs;
