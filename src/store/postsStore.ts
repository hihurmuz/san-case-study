import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Post } from "@/types/index";

interface PostsState {
  posts: Post[];
  selectedPost: Post | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (id: number, updatedPost: Partial<Post>) => void;
  deletePost: (id: number) => void;
  setSelectedPost: (post: Post | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Selectors
  getPostById: (id: number) => Post | undefined;
  getPostsByUserId: (userId: number) => Post[];
}

/**
 * Posts store using Zustand for global state management
 * Manages posts data, loading states, and CRUD operations
 */
export const usePostsStore = create<PostsState>()(
  devtools(
    (set, get) => ({
      posts: [],
      selectedPost: null,
      isLoading: false,
      error: null,

      setPosts: (posts) => {
        set({ posts, error: null }, false, "setPosts");
      },

      addPost: (post) => {
        set(
          (state) => ({
            posts: [post, ...state.posts],
            error: null,
          }),
          false,
          "addPost"
        );
      },

      updatePost: (id, updatedPost) => {
        set(
          (state) => ({
            posts: state.posts.map((post) =>
              post.id === id ? { ...post, ...updatedPost } : post
            ),
            selectedPost:
              state.selectedPost?.id === id
                ? { ...state.selectedPost, ...updatedPost }
                : state.selectedPost,
            error: null,
          }),
          false,
          "updatePost"
        );
      },

      deletePost: (id) => {
        set(
          (state) => ({
            posts: state.posts.filter((post) => post.id !== id),
            selectedPost:
              state.selectedPost?.id === id ? null : state.selectedPost,
            error: null,
          }),
          false,
          "deletePost"
        );
      },

      setSelectedPost: (post) => {
        set({ selectedPost: post }, false, "setSelectedPost");
      },

      setLoading: (loading) => {
        set({ isLoading: loading }, false, "setLoading");
      },

      setError: (error) => {
        set({ error, isLoading: false }, false, "setError");
      },

      getPostById: (id) => {
        return get().posts.find((post) => post.id === id);
      },

      getPostsByUserId: (userId) => {
        return get().posts.filter((post) => post.userId === userId);
      },
    }),
    {
      name: "posts-store",
    }
  )
);

export default usePostsStore;
