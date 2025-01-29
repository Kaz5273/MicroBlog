import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Post {
  id: number;
  content: string;
  author: string;
  createdAt: string;
}

interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <div className="space-y-4">
      {posts.map(post => {
        const date = new Date(post.createdAt);
        const isValidDate = !isNaN(date.getTime());
        return (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <div className="text-lg font-semibold">{post.author}</div>
              <div className="ml-auto text-sm text-gray-500">
                {isValidDate ? formatDistanceToNow(date, { addSuffix: true, locale: fr }) : 'Date invalide'}
              </div>
            </div>
            <p className="text-gray-800">{post.content}</p>
          </div>
        );
      })}
    </div>
  );
};

export default PostList;