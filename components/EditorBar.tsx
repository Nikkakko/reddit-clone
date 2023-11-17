'use client';
import { Editor } from '@tiptap/react';
import * as React from 'react';

import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Underline,
  Heading2,
  Link,
} from 'lucide-react';
import { Toggle } from './ui/toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface EditorBarProps {
  editor: Editor | null;
}

const EditorBar: React.FC<EditorBarProps> = ({ editor }) => {
  const [isPending, startTransition] = React.useTransition();

  if (!editor) return null;
  return (
    <div className='border border-input bg-secondary w-full max-w-full '>
      <div className='flex items-center  space-x-2 flex-wrap w-full'>
        <Toggle
          size='sm'
          pressed={editor.isActive('heading')}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Heading2 className='h-4 w-4' />
            </TooltipTrigger>
            <TooltipContent>Heading</TooltipContent>
          </Tooltip>
        </Toggle>

        <Toggle
          size='sm'
          pressed={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Bold className='h-4 w-4' />
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>
        </Toggle>

        <Toggle
          size='sm'
          pressed={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Italic className='h-4 w-4' />
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>
        </Toggle>

        <Toggle
          size='sm'
          pressed={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Strikethrough className='h-4 w-4' />
            </TooltipTrigger>
            <TooltipContent>Strikethrough</TooltipContent>
          </Tooltip>
        </Toggle>

        <Toggle
          size='sm'
          pressed={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <List className='h-4 w-4' />
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>
        </Toggle>

        <Toggle
          size='sm'
          pressed={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <ListOrdered className='h-4 w-4' />
            </TooltipTrigger>
            <TooltipContent>Ordered List</TooltipContent>
          </Tooltip>
        </Toggle>

        <Toggle
          size='sm'
          className='px-0 md:px-2.5'
          pressed={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Underline className='h-4 w-4' />
            </TooltipTrigger>
            <TooltipContent>Underline</TooltipContent>
          </Tooltip>
        </Toggle>
      </div>{' '}
    </div>
  );
};

export default EditorBar;
