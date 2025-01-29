import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface PostFormProps {
  onSubmit: (content: string, username: string) => Promise<void>;
}

export function PostForm({ onSubmit }: PostFormProps) {
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !username.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(content, username);
      setContent('');
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white rounded-lg shadow p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      <div className="mb-4">
        <textarea
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          required
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        <Send className="w-4 h-4 mr-2" />
        Post
      </button>
    </form>
  );
}