'use server';

import { db } from '@/lib/db';
import { ExtendedPost } from '@/types/db';
import { currentUser, clerkClient } from '@clerk/nextjs/server';

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
