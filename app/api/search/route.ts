import { db } from '@/lib/db';
import { z } from 'zod';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q');

    if (!q) {
      return new Response('Missing query', { status: 400 });
    }
    const results = await db.subreddit.findMany({
      where: {
        name: {
          startsWith: q,
          mode: 'insensitive',
        },
      },

      include: {
        _count: true,
      },

      take: 5,
    });

    return new Response(JSON.stringify(results));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      'An unexpected error occurred. Please try again later.',
      { status: 500 }
    );
  }
}
