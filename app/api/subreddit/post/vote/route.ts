import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { postId, voteType } = body;

    const session = await currentUser();

    if (!session) {
      return new Response('Unauthorized', { status: 401 });
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
      return new Response('Post not found', { status: 404 });
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
    return new Response('OK');
  } catch (error) {
    error;
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      'Could not post to subreddit at this time. Please try later',
      { status: 500 }
    );
  }
}
