'use server';
import { db } from '@/lib/db';
import { getUserEmail } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs/server';

export default async function createCommunityAction(input: string) {
  const user = await currentUser();

  const creatorName = getUserEmail(user);

  if (!user) {
    return {
      error401: 'You must be logged in to create a community',
    };
  }

  try {
    const subredditExists = await db.subreddit.findFirst({
      where: {
        name: input,
      },
    });

    if (subredditExists) {
      return {
        error409: 'Community already exists',
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

    return {
      success: subreddit.name,
    };
  } catch (error) {
    return {
      error422: 'Something went wrong',
    };
  }
}
