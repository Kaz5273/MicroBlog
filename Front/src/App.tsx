import React, { useEffect, useState } from 'react';
import { fetchPosts, createPost } from './api/posts';
import PostList from './components/PostList';
import PostForm from './components/PostForm';

interface Post {
  id: number;
  content: string;
  author: string;
  createdAt: string;
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchPosts();
        const offlinePosts = JSON.parse(localStorage.getItem('offlinePosts') || '[]');
        setPosts([...offlinePosts, ...fetchedPosts]);
      } catch (err) {
        setError('Échec du chargement des posts');
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleCreatePost = async (content: string, author: string, createdAt: string) => {
    try {
      console.log('Création du post avec le contenu:', content, 'auteur:', author, 'et créé à:', createdAt);
      const newPost = await createPost(content, author, createdAt);
      console.log('Nouveau post créé:', newPost);
      setPosts([newPost, ...posts]);
      // Stocker les posts hors ligne
      const offlinePosts = JSON.parse(localStorage.getItem('offlinePosts') || '[]');
      offlinePosts.push(newPost);
      localStorage.setItem('offlinePosts', JSON.stringify(offlinePosts));
    } catch (err) {
      console.error('Échec de la création du post:', err);
      setError('Échec de la création du post');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">MicroBlog</h1>
        
        {!isOnline && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            Mode hors ligne actif - Les posts seront synchronisés une fois la connexion rétablie
          </div>
        )}
        
        <PostForm onSubmit={handleCreatePost} />
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center">Chargement des posts...</div>
        ) : (
          <PostList posts={posts} />
        )}
      </div>
    </div>
  );
};

export default App;