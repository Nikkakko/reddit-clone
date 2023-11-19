import dynamic from 'next/dynamic';
import Image from 'next/image';
import * as React from 'react';

interface EditorOutputProps {
  content:
    | {
        text: string;
        image: string;
      }
    | any;
}

const EditorOutput: React.FC<EditorOutputProps> = ({ content }) => {
  return (
    <div className='relative w-full min-h-[15rem]'>
      {content.image ? (
        <Image
          src={content.image}
          fill
          sizes='100vw'
          className='object-contain'
          alt='post-image'
        />
      ) : null}
    </div>
  );
};

export default EditorOutput;
