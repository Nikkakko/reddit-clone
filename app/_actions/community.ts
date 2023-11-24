'use server';
import { db } from '@/lib/db';
import { getUserEmail } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';

export default async function createCommunityAction(input: string) {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        error401: {
          title: 'Not authenticated',
          message: 'You must be logged in to create a community',
        },
      };
    }
    const subredditExists = await db.subreddit.findFirst({
      where: {
        name: input,
      },
    });

    if (subredditExists) {
      return {
        error409: {
          title: 'Community already exists',
          message: 'A community with that name already exists',
        },
      };
    }

    const subreddit = await db.subreddit.create({
      data: {
        name: input,
        creatorId: user.id,
        userId: user.id,
        creator: user.firstName as string,
      },
    });

    await db.subscription.create({
      data: {
        userId: user.id,
        subredditId: subreddit.id,
      },
    });

    revalidatePath('/r/' + subreddit.name);
    return {
      success: subreddit.name,
    };
  } catch (error) {
    return {
      error422: {
        title: 'Unable to create community',
        message: 'Unable to create community',
      },
    };
  }
}
