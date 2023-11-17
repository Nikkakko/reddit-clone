'use client';
import * as React from 'react';
import { useEditor, EditorContent, EditorContentProps } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useTheme } from 'next-themes';
import EditorBar from './EditorBar';
import Underline from '@tiptap/extension-underline';
import { UseFormSetValue } from 'react-hook-form';
import { PostCreationRequest } from '@/lib/validation';

interface EditorProps {
  contentValue: string;
  setValue: UseFormSetValue<PostCreationRequest>;
}

const Editor: React.FC<EditorProps> = ({ contentValue, setValue }) => {
  const { resolvedTheme } = useTheme();

  const editor = useEditor({
    extensions: [StarterKit.configure({}), Underline],
    content: contentValue,

    onUpdate: ({ editor }) => {
      setValue('content', editor.getHTML(), { shouldValidate: true });
    },
    editorProps: {
      attributes: {
        class:
          'flex min-h-[80px] w-full  border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-full w-full  resize-none',
      },
    },
  });

  return (
    <div className='flex flex-col gap-y-2 max-w-full '>
      <EditorContent
        editor={editor}
        className='w-full max-w-full border border-input'
        children={<EditorBar editor={editor} />}
      />
    </div>
  );
};

export default Editor;
