'use server';

import { UTApi } from 'uploadthing/server';

const api = new UTApi();

export const deleteImage = async (imageId: string) => {
  try {
    await api.deleteFiles(imageId);
  } catch (error) {
    console.error(error);
  }
};
