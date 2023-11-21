'use server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { SubscibeToSubredditPayload } from '@/lib/validation';
import * as z from 'zod';
import { revalidatePath } from 'next/cache';
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/lib/config';
import { VoteType } from '@prisma/client';

export async function getSubbreditPosts(slug: string) {
  try {
    const subreddit = await db.subreddit.findFirst({
      where: {
        name: slug,
      },
      include: {
        posts: {
          include: {
            votes: true,
            comments: true,
            subreddit: true,
          },
        },
      },

      take: INFINITE_SCROLL_PAGINATION_RESULTS,
    });

    if (!subreddit) {
      return {
        error404: {
          title: 'Not Found',
          message: 'This subreddit does not exist',
        },
      };
    }
    revalidatePath('/');
    return {
      data: subreddit,
    };
  } catch (error) {
    return {
      error500: {
        title: 'Internal Server Error',
        message: 'There was an error fetching posts for this subreddit',
      },
    };
  }
}

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

    revalidatePath('/');

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

    revalidatePath('/');

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

export const createSubredditPost = async (
  subredditId: SubscibeToSubredditPayload['subredditId'],
  title: string,
  content: string
) => {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        error401: {
          title: 'Unauthorized',
          message: 'You must be logged in to create a post',
        },
      };
    }

    //verify user is subscribed to to passed subreddit id
    const subExists = await db.subscription.findFirst({
      where: {
        userId: user.id,
        subredditId: subredditId,
      },
    });

    if (!subExists) {
      return {
        error400: {
          title: 'Error',
          message: 'You have not subscribed to this subreddit',
        },
      };
    }

    await db.post.create({
      data: {
        title,
        content,
        subredditId,
        author: user.firstName + ' ' + user.lastName,
      },
    });

    revalidatePath('/');
    return {
      success: {
        title: 'Success',
        message: 'You have successfully created a post',
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error400: {
          title: 'Error',
          message: error.message,
        },
      };
    }

    return {
      error500: {
        title: 'Internal Server Error',
        message: 'There was an error creating a post',
      },
    };
  }
};

export const createSubredditComment = async (
  postId: string,
  text: string,
  replyToId: string | undefined
) => {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        error401: {
          title: 'Unauthorized',
          message: 'You must be logged in to create a comment',
        },
      };
    }

    await db.comment.create({
      data: {
        text,
        postId,
        replyToId,
        author: user.firstName + ' ' + user.lastName,
        authorImage: user.imageUrl,
      },
    });

    revalidatePath('/');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error400: {
          title: 'Error',
          message: error.message,
        },
      };
    }

    return {
      error500: {
        title: 'Internal Server Error',
        message: 'There was an error creating a comment',
      },
    };
  }
};

export const voteOnCommentAction = async (
  commentId: string,
  voteType: VoteType
) => {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        error401: {
          title: 'Unauthorized',
          message: 'You must be logged in to vote on a comment',
        },
      };
    }

    const existingVote = await db.commentVote.findFirst({
      where: {
        userId: user.id,
        commentId,
      },
    });
    if (existingVote) {
      // if vote type is the same as existing vote, delete the vote
      if (existingVote.type === voteType) {
        await db.commentVote.delete({
          where: {
            commentId,
            userId: user.id,
            id: existingVote.id,
          },
        });
      } else {
        // if vote type is different, update the vote
        await db.commentVote.update({
          where: {
            commentId,
            userId: user.id,
            id: existingVote.id,
          },
          data: {
            type: voteType,
          },
        });
      }
    }

    // if no existing vote, create a new vote
    await db.commentVote.create({
      data: {
        type: voteType,
        userId: user.id,
        commentId,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error400: {
          title: 'Error',
          message: error.message,
        },
      };
    }

    return {
      error500: {
        title: 'Internal Server Error',
        message: 'There was an error voting on this comment',
      },
    };
  }
};
