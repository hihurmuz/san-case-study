import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { commentsApi } from "@/services/api";
import { useCommentsStore } from "@/store/commentsStore";

/**
 * Enhanced comments hooks that integrate React Query with Zustand store
 */

// Hook for fetching all comments with Zustand integration
export const useCommentsWithStore = () => {
  const {
    comments,
    isLoading,
    error,
    setComments,
    setLoading,
    setError,
    getRecentComments,
  } = useCommentsStore();

  const queryResult = useQuery({
    queryKey: ["comments"],
    queryFn: commentsApi.getComments,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Sync React Query data with Zustand store
  useEffect(() => {
    if (queryResult.data) {
      setComments(queryResult.data);
    }
    setLoading(queryResult.isLoading);
    setError(queryResult.error ? String(queryResult.error) : null);
  }, [
    queryResult.data,
    queryResult.isLoading,
    queryResult.error,
    setComments,
    setLoading,
    setError,
  ]);

  return {
    data: comments,
    isLoading,
    error,
    refetch: queryResult.refetch,
    getRecentComments,
  };
};

// Hook for fetching comments for a specific post with Zustand integration
export const usePostCommentsWithStore = (postId: number) => {
  const {
    commentsByPost,
    isLoading,
    error,
    setPostComments,
    setLoading,
    setError,
    getCommentsByPostId,
  } = useCommentsStore();

  const queryResult = useQuery({
    queryKey: ["comments", "post", postId],
    queryFn: () => commentsApi.getPostComments(postId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!postId,
  });

  // Sync React Query data with Zustand store
  useEffect(() => {
    if (queryResult.data && postId) {
      setPostComments(postId, queryResult.data);
    }
    setLoading(queryResult.isLoading);
    setError(queryResult.error ? String(queryResult.error) : null);
  }, [
    queryResult.data,
    queryResult.isLoading,
    queryResult.error,
    postId,
    setPostComments,
    setLoading,
    setError,
  ]);

  // Get comments from store, fallback to query data
  const comments = getCommentsByPostId(postId) || queryResult.data || [];

  return {
    data: comments,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    refetch: queryResult.refetch,
  };
};
