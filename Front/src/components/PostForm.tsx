import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface PostFormProps {
  onSubmit: (content: string, author: string, createdAt: string) => Promise<void>;
}

export function PostForm({ onSubmit }: PostFormProps) {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !author.trim()) return;
    
    setIsSubmitting(true);
    try {
      const createdAt = new Date().toISOString();
      await onSubmit(content, author, createdAt);
      setContent('');
      setAuthor('');
    } catch (error) {
      console.error('Échec de la création du post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white rounded-lg shadow p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Votre nom"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      <div className="mb-4">
        <textarea
          placeholder="Que se passe-t-il ?"
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
        className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
      </button>
    </form>
  );
}

export default PostForm;