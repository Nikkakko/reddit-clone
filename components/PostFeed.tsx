'use client';
import { ExtendedPost } from '@/types/db';
import * as React from 'react';

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  subredditName?: string;
}

const PostFeed: React.FC<PostFeedProps> = ({ initialPosts, subredditName }) => {
  return <div>PostFeed</div>;
};

export default PostFeed;
