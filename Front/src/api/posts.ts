const API_URL = 'https://127.0.0.1/api';

export async function fetchPosts(): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/posts`);
    return response.json();
  } catch (error) {
    // Si hors ligne, essayer de récupérer depuis le cache
    const cache = await caches.open('api-posts');
    const cachedResponse = await cache.match(`${API_URL}/posts`);
    if (cachedResponse) {
      return cachedResponse.json();
    }
    throw error;
  }
}

export async function createPost(content: string, username: string): Promise<any> {
  const postData = { content, username };
  
  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    return response.json();
  } catch (error) {
    throw error;
  }
}