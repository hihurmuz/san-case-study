import React, { useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePosts, useDeletePost } from "@/hooks/usePosts";
import { useNavigation } from "@/utils/navigationGenerator";
import { usePermissions } from "@/hooks/usePermissions";
import type { Post } from "@/types/index";

const PostsPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: posts = [], isLoading, error } = usePosts();
  const deletePostMutation = useDeletePost();
  const nav = useNavigation();
  const { canEditPost } = usePermissions();

  const handleDelete = useCallback(
    async (id: number) => {
      if (
        window.confirm(
          t("posts.confirmDelete", "Are you sure you want to delete this post?")
        )
      ) {
        try {
          await deletePostMutation.mutateAsync(id);
          alert(t("posts.deleteSuccess", "Post deleted successfully"));
        } catch (error) {
          alert(
            `${t("errors.errorLoadingPosts")}: ${
              error instanceof Error ? error.message : t("errors.unknownError")
            }`
          );
        }
      }
    },
    [deletePostMutation, t]
  );

  // Memoize sorted posts to prevent unnecessary re-sorting
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => b.id - a.id);
  }, [posts]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded">
          <p className="font-medium">{t("errors.errorLoadingPosts")}</p>
          <p className="text-sm">
            {error instanceof Error ? error.message : t("errors.unknownError")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          {t("posts.title")}
        </h1>
        {canEditPost() && (
          <Link
            to={nav.createPost.get()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {t("posts.createNewPost")}
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {t("posts.noPostsAvailable")}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedPosts.map((post: Post) => (
              <li
                key={post.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Link
                      to={nav.post.get({ id: post.id })}
                      className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
                    >
                      {post.title}
                    </Link>
                    <p className="text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {post.body}
                    </p>
                  </div>

                  {canEditPost() && (
                    <div className="flex space-x-2 ml-4">
                      <Link
                        to={nav.postEdit.get({ id: post.id })}
                        className="px-3 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-700 transition"
                      >
                        {t("posts.edit")}
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="px-3 py-1 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-700 transition"
                        disabled={deletePostMutation.isPending}
                      >
                        {deletePostMutation.isPending &&
                        post.id === deletePostMutation.variables
                          ? t("posts.deleting")
                          : t("posts.delete")}
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PostsPage;
