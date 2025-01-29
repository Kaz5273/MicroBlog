const API_URL = 'https://127.0.0.1:8000/api';

export async function fetchPosts(): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/posts`);
    return response.json();
  } catch (error) {
    const cache = await caches.open('api-posts');
    const cachedResponse = await cache.match(`${API_URL}/posts`);
    if (cachedResponse) {
      return cachedResponse.json();
    }
    throw error;
  }
}

export async function createPost(content: string, author: string, createdAt: string): Promise<any> {
  const postData = { content, author, createdAt };
  
  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    throw error;
  }
}