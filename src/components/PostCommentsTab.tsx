import React from "react";
import { usePostComments } from "@/hooks/useComments";
import type { Comment } from "@/types/index";
import { useTranslation } from "react-i18next";

interface PostCommentsTabProps {
  postId: number;
}

const PostCommentsTab: React.FC<PostCommentsTabProps> = ({ postId }) => {
  const { t } = useTranslation();
  const { data: comments = [], isLoading, error } = usePostComments(postId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-medium">{t("comments.errorLoadingComments")}</p>
        <p className="text-sm">
          {error instanceof Error ? error.message : t("errors.unknownError")}
        </p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t("comments.noCommentsAvailable")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        {t("comments.commentsCount", { count: comments.length })}
      </h2>

      <div className="space-y-4">
        {comments.map((comment: Comment) => (
          <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                  {comment.email.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {comment.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{comment.email}</p>
                <div className="mt-2 text-sm text-gray-700 dark:text-gray-200">
                  <p>{comment.body}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostCommentsTab;
