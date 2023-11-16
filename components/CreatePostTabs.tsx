'use client';
import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import Editor from './Editor';

interface CreatePostTabsProps {}

const CreatePostTabs: React.FC<CreatePostTabsProps> = ({}) => {
  const [title, setTitle] = React.useState('');
  return (
    <Tabs defaultValue='post' className='w-full'>
      <TabsList>
        <TabsTrigger value='post'>Post</TabsTrigger>
        <TabsTrigger value='upload-file'>Image & Video</TabsTrigger>
      </TabsList>
      <div className='mt-2'>
        <Input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder='Title'
        />
      </div>

      <TabsContent value='post'>
        <Editor title={title} />
      </TabsContent>
      <TabsContent value='upload-file'>Upload File</TabsContent>
    </Tabs>
  );
};

export default CreatePostTabs;
