import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { z } from 'zod';

export async function GET(req: Request) {
  const url = new URL(req.url);

  const session = await currentUser();

  let followedCommunitiesIds: string[] = [];

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

  try {
    const { limit, page, subredditName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subredditName: z.string().nullish().optional(),
      })
      .parse({
        subredditName: url.searchParams.get('subredditName'),
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page'),
      });

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
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
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

    return new Response(JSON.stringify(posts));
  } catch (error) {
    return new Response('Could not fetch posts', { status: 500 });
  }
}
