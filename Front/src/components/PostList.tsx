import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { Post } from '../types/Post';

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-2">
            <span className="font-bold text-gray-900">@{post.username}</span>
            <span className="ml-2 text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </span>
          </div>
          <p className="text-gray-800">{post.content}</p>
        </div>
      ))}
    </div>
  );
}