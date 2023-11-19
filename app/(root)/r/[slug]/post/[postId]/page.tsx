import * as React from 'react';

interface Props {
  params: {
    postId: string;
  };
}

async function PostDetailPage({ params: { postId } }: Props) {
  return (
    <div>
      <h1>PostDetailPage</h1>
      <p>postId: {postId}</p>
    </div>
  );
}

export default PostDetailPage;
