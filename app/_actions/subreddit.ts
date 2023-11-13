'use server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { SubscibeToSubredditPayload } from '@/lib/validation';

export const subscribeAction = async (
  subredditId: SubscibeToSubredditPayload['subredditId']
) => {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        error401: {
          title: 'Unauthorized',
          message: 'You must be logged in to subscribe to a subreddit',
        },
      };
    }

    //check if user has already subscribed to subreddit
    const subExists = await db.subscription.findFirst({
      where: {
        userId: user.id,
        subredditId: subredditId,
      },
    });

    if (subExists) {
      return {
        error400: {
          title: 'Conflict',
          message: 'You have already subscribed to this subreddit',
        },
      };
    }

    //create subreddit and associate with user
    await db.subscription.create({
      data: {
        subredditId,
        userId: user.id,
      },
    });

    return {
      success: {
        title: 'Subscribed Successfully',
        message: 'You have successfully subscribed to this subreddit',
      },
    };
  } catch (error) {
    return {
      error500: {
        title: 'Internal Server Error',
        message: 'There was an error subscribing to this subreddit',
      },
    };
  }
};

export const unsubscribeAction = async (
  subredditId: SubscibeToSubredditPayload['subredditId']
) => {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        error401: {
          title: 'Unauthorized',
          message: 'You must be logged in to unsubscribe from a subreddit',
        },
      };
    }

    //check if user has already subscribed to subreddit
    const subExists = await db.subscription.findFirst({
      where: {
        userId: user.id,
        subredditId: subredditId,
      },
    });

    if (!subExists) {
      return {
        error400: {
          title: 'Conflict',
          message: 'You have not subscribed to this subreddit,yet',
        },
      };
    }

    //create subreddit and associate with user
    await db.subscription.delete({
      where: {
        id: subExists.id,
      },
    });

    return {
      success: {
        title: 'Success',
        message: 'You have successfully unsubscribed from this subreddit',
      },
    };
  } catch (error) {
    return {
      error500: {
        title: 'Internal Server Error',
        message: 'There was an error unsubscribing from this subreddit',
      },
    };
  }
};