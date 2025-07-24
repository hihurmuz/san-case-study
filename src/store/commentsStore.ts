import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Comment } from "@/types/index";

interface CommentsState {
  comments: Comment[];
  commentsByPost: Record<number, Comment[]>;
  isLoading: boolean;
  error: string | null;

  // Actions
  setComments: (comments: Comment[]) => void;
  setPostComments: (postId: number, comments: Comment[]) => void;
  addComment: (comment: Comment) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Selectors
  getCommentsByPostId: (postId: number) => Comment[];
  getCommentById: (id: number) => Comment | undefined;
  getRecentComments: (limit?: number) => Comment[];
}

/**
 * Comments store using Zustand for global state management
 * Manages comments data, loading states, and operations
 */
export const useCommentsStore = create<CommentsState>()(
  devtools(
    (set, get) => ({
      comments: [],
      commentsByPost: {},
      isLoading: false,
      error: null,

      setComments: (comments) => {
        set({ comments, error: null }, false, "setComments");
      },

      setPostComments: (postId, comments) => {
        set(
          (state) => ({
            commentsByPost: {
              ...state.commentsByPost,
              [postId]: comments,
            },
            error: null,
          }),
          false,
          "setPostComments"
        );
      },

      addComment: (comment) => {
        set(
          (state) => ({
            comments: [comment, ...state.comments],
            commentsByPost: {
              ...state.commentsByPost,
              [comment.postId]: [
                comment,
                ...(state.commentsByPost[comment.postId] || []),
              ],
            },
            error: null,
          }),
          false,
          "addComment"
        );
      },

      setLoading: (loading) => {
        set({ isLoading: loading }, false, "setLoading");
      },

      setError: (error) => {
        set({ error, isLoading: false }, false, "setError");
      },

      getCommentsByPostId: (postId) => {
        return get().commentsByPost[postId] || [];
      },

      getCommentById: (id) => {
        return get().comments.find((comment) => comment.id === id);
      },

      getRecentComments: (limit = 5) => {
        return get()
          .comments.sort((a, b) => b.id - a.id)
          .slice(0, limit);
      },
    }),
    {
      name: "comments-store",
    }
  )
);

export default useCommentsStore;
