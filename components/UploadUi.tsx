'use client';
import * as React from 'react';
import { UploadButton } from '@/lib/uploadthing';
import { useToast } from './ui/use-toast';
import Image from 'next/image';
import { Button } from './ui/button';
import { Icons } from './Icons';
import { deleteImage } from '@/app/_actions/upload';

const UploadUi = () => {
  const [image, setImage] = React.useState<string | null>(null);
  const [imageName, setImageName] = React.useState<string>('');
  const { toast } = useToast();

  React.useEffect(() => {
    //save image name and url to local storage
    localStorage.getItem('image') && setImage(localStorage.getItem('image'));
    localStorage.getItem('imageName') &&
      setImageName(localStorage.getItem('imageName')!);
  }, []);

  const handleDelete = () => {
    setImage(null);
    deleteImage(imageName);
    localStorage.removeItem('image');
    localStorage.removeItem('imageName');
  };

  const handleUpload = (url: string, key: string) => {
    setImage(url);
    setImageName(key);
    localStorage.setItem('image', url);
    localStorage.setItem('imageName', key);
    toast({
      title: 'Image Uploaded',
      description: 'Your image has been uploaded successfully.',
      duration: 3000,
    });
  };

  return (
    <div className='w-full border p-2'>
      {image ? (
        <div className='relative h-full min-h-[500px]'>
          <Image
            src={image}
            alt='Uploaded Image'
            fill
            sizes='(min-width: 808px) 50vw, 100vw'
            className='object-cover'
          />

          <Button
            className='absolute top-2 right-2'
            variant='destructive'
            onClick={handleDelete}
          >
            <Icons.trash className='w-4 h-4' />
          </Button>
        </div>
      ) : (
        <UploadButton
          endpoint='imageUploader'
          onClientUploadComplete={res => {
            // Do something with the response
            handleUpload(res[0].url, res[0].key);
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.

            toast({
              title: 'Error',
              description: error.message,
              duration: 3000,
            });
          }}
        />
      )}
    </div>
  );
};

export default UploadUi;
