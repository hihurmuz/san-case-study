import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "@/services/api";
import { usePostsStore } from "@/store/postsStore";
import type { Post } from "@/types/index";

/**
 * Enhanced posts hooks that integrate React Query with Zustand store
 */

// Hook for fetching all posts with Zustand integration
export const usePostsWithStore = () => {
  const { posts, isLoading, error, setPosts, setLoading, setError } =
    usePostsStore();

  const queryResult = useQuery({
    queryKey: ["posts"],
    queryFn: postsApi.getPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Sync React Query data with Zustand store
  useEffect(() => {
    if (queryResult.data) {
      setPosts(queryResult.data);
    }
    setLoading(queryResult.isLoading);
    setError(queryResult.error ? String(queryResult.error) : null);
  }, [
    queryResult.data,
    queryResult.isLoading,
    queryResult.error,
    setPosts,
    setLoading,
    setError,
  ]);

  return {
    data: posts,
    isLoading,
    error,
    refetch: queryResult.refetch,
  };
};

// Hook for fetching a single post with Zustand integration
export const usePostWithStore = (id: number) => {
  const { selectedPost, setSelectedPost, setLoading, setError, getPostById } =
    usePostsStore();

  const queryResult = useQuery({
    queryKey: ["post", id],
    queryFn: () => postsApi.getPost(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });

  // Sync React Query data with Zustand store
  useEffect(() => {
    if (queryResult.data) {
      setSelectedPost(queryResult.data);
    }
    setLoading(queryResult.isLoading);
    setError(queryResult.error ? String(queryResult.error) : null);
  }, [
    queryResult.data,
    queryResult.isLoading,
    queryResult.error,
    setSelectedPost,
    setLoading,
    setError,
  ]);

  // Try to get from store first, fallback to query data
  const post =
    selectedPost?.id === id
      ? selectedPost
      : getPostById(id) || queryResult.data;

  return {
    data: post,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    refetch: queryResult.refetch,
  };
};

// Hook for creating a post with Zustand integration
export const useCreatePostWithStore = () => {
  const queryClient = useQueryClient();
  const { addPost } = usePostsStore();

  return useMutation({
    mutationFn: (post: Omit<Post, "id">) => postsApi.createPost(post),
    onSuccess: (newPost) => {
      // Add to Zustand store
      addPost(newPost);

      // Invalidate React Query cache
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.setQueryData(["post", newPost.id], newPost);
    },
  });
};

// Hook for updating a post with Zustand integration
export const useUpdatePostWithStore = () => {
  const queryClient = useQueryClient();
  const { updatePost } = usePostsStore();

  return useMutation({
    mutationFn: ({ id, post }: { id: number; post: Partial<Post> }) =>
      postsApi.updatePost(id, post),
    onSuccess: (updatedPost) => {
      // Update in Zustand store
      updatePost(updatedPost.id, updatedPost);

      // Update React Query cache
      queryClient.setQueryData(["post", updatedPost.id], updatedPost);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

// Hook for deleting a post with Zustand integration
export const useDeletePostWithStore = () => {
  const queryClient = useQueryClient();
  const { deletePost } = usePostsStore();

  return useMutation({
    mutationFn: (id: number) => postsApi.deletePost(id),
    onSuccess: (_, deletedId) => {
      // Remove from Zustand store
      deletePost(deletedId);

      // Remove from React Query cache
      queryClient.removeQueries({ queryKey: ["post", deletedId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
