import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "@/services/api";
import type { Post } from "@/types/index";

// Hook for fetching all posts
export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: postsApi.getPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching a single post by ID
export const usePost = (id: number) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => postsApi.getPost(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id, // Only run query if ID is provided
  });
};

// Hook for creating a new post
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: Omit<Post, "id">) => postsApi.createPost(post),
    onSuccess: (newPost) => {
      // Invalidate posts list query to refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      // Add new post to cache
      queryClient.setQueryData(["post", newPost.id], newPost);
    },
  });
};

// Hook for updating an existing post
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, post }: { id: number; post: Partial<Post> }) =>
      postsApi.updatePost(id, post),
    onSuccess: (updatedPost) => {
      // Update post in cache
      queryClient.setQueryData(["post", updatedPost.id], updatedPost);

      // Invalidate posts list to refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

// Hook for deleting a post
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postsApi.deletePost(id),
    onSuccess: (_, deletedId) => {
      // Remove post from cache
      queryClient.removeQueries({ queryKey: ["post", deletedId] });

      // Invalidate posts list to refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
