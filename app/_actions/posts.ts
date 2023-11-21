'use server';

import { db } from '@/lib/db';
import { PostVoteValidator } from '@/lib/validation';
import { ExtendedPost } from '@/types/db';
import { currentUser, clerkClient } from '@clerk/nextjs/server';
import { VoteType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getPosts(
  limit: number,
  pageParam: number,
  subredditName: string | undefined
) {
  try {
    let followedCommunitiesIds: string[] = [];
    const session = await currentUser();
    const page = pageParam || 1;
    const offset = (page - 1) * limit;

    if (session) {
      const followedCommunities = await db.subscription.findMany({
        where: {
          userId: session.id,
          subreddit: {
            NOT: {
              id: undefined,
            },
          },
        },
        include: {
          subreddit: true,
        },
      });

      followedCommunitiesIds = followedCommunities.map(sub => sub.subreddit.id);
    }

    let whereClause = {};

    if (subredditName) {
      whereClause = {
        subreddit: {
          name: subredditName,
        },
      };
    } else if (session) {
      whereClause = {
        subreddit: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      };
    }

    const posts = await db.post.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        subreddit: true,
        votes: true,
        comments: true,
      },
      where: whereClause,
    });

    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    return {
      error: 'Something went wrong.',
    };
  }
}

export async function voteToPostAction(postId: string, voteType: VoteType) {
  try {
    const session = await currentUser();

    if (!session) {
      return {
        error: 'You must be logged in to vote.',
      };
    }

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },

      include: {
        votes: true,
      },
    });

    if (!post) {
      return {
        error: 'Post not found.',
      };
    }

    const existingVote = await db.vote.findFirst({
      where: {
        postId: postId,
        userId: session.id,
      },
    });

    //based on voteType is UP or DOWN update the vote

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            id: existingVote.id,
          },
        });
      }

      await db.vote.update({
        where: {
          id: existingVote.id,
        },
        data: {
          type: voteType,
        },
      });
    } else {
      await db.vote.create({
        data: {
          type: voteType,
          userId: session.id,
          postId,
        },
      });
    }

    revalidatePath('/');
  } catch (error) {
    return {
      error: 'Something went wrong.',
    };
  }
}

export async function postsVotes(postId: string) {
  try {
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        votes: true,
      },
    });

    if (!post) {
      return {
        error: 'Post not found.',
      };
    }

    return JSON.parse(JSON.stringify(post.votes));
  } catch (error) {
    return {
      error: 'Something went wrong.',
    };
  }
}
