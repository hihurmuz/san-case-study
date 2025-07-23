import { useQuery } from "@tanstack/react-query";
import { commentsApi } from "@/services/api";

// Hook for fetching all comments
export const useComments = () => {
  return useQuery({
    queryKey: ["comments"],
    queryFn: commentsApi.getComments,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching comments for a specific post
export const usePostComments = (postId: number) => {
  return useQuery({
    queryKey: ["comments", "post", postId],
    queryFn: () => commentsApi.getPostComments(postId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!postId, // Only run query if postId is provided
  });
};

// Hook for fetching a single comment by ID
export const useComment = (id: number) => {
  return useQuery({
    queryKey: ["comment", id],
    queryFn: () => commentsApi.getComment(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id, // Only run query if ID is provided
  });
};
