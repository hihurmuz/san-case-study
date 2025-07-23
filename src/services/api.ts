import type { Post, Comment } from "@/types/index";
import { logError } from "@/utils/errorHandling";

// Base URL for JSONPlaceholder API
const API_BASE_URL = "https://jsonplaceholder.typicode.com";

// Generic fetch function with error handling
async function fetchData<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      // Create a more detailed error message
      const errorMessage = `API Error: ${response.status} ${response.statusText}`;

      // Try to parse error response body if available
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || errorMessage);
      } catch (parseError) {
        // If we can't parse the error response, use the default message
        throw new Error(errorMessage);
      }
    }

    return (await response.json()) as T;
  } catch (error) {
    // Log the error with context
    logError(error, `API fetch: ${url}`);

    // Rethrow to let the caller handle it
    throw error;
  }
}

// Posts API endpoints
export const postsApi = {
  // Get all posts
  getPosts: () => fetchData<Post[]>(`${API_BASE_URL}/posts`),

  // Get a single post by ID
  getPost: (id: number) => fetchData<Post>(`${API_BASE_URL}/posts/${id}`),

  // Create a new post
  createPost: (post: Omit<Post, "id">) =>
    fetchData<Post>(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    }),

  // Update an existing post
  updatePost: (id: number, post: Partial<Post>) =>
    fetchData<Post>(`${API_BASE_URL}/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    }),

  // Delete a post
  deletePost: (id: number) =>
    fetchData<{}>(`${API_BASE_URL}/posts/${id}`, {
      method: "DELETE",
    }),
};

// Comments API endpoints
export const commentsApi = {
  // Get all comments
  getComments: () => fetchData<Comment[]>(`${API_BASE_URL}/comments`),

  // Get comments for a specific post
  getPostComments: (postId: number) =>
    fetchData<Comment[]>(`${API_BASE_URL}/posts/${postId}/comments`),

  // Get a single comment by ID
  getComment: (id: number) =>
    fetchData<Comment>(`${API_BASE_URL}/comments/${id}`),
};
