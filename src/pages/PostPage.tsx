import React from "react";
import { useParams, useLocation, Link, Navigate } from "react-router-dom";
import { usePost } from "@/hooks/usePosts";
import { useNavigation } from "@/utils/navigationGenerator";
import { usePermissions } from "@/hooks/usePermissions";
import Layout from "@/components/Layout";
import EditPostTab from "@/components/EditPostTab";
import PostCommentsTab from "@/components/PostCommentsTab";

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const postId = id ? parseInt(id, 10) : 0;
  const { data: post, isLoading, error } = usePost(postId);
  const nav = useNavigation();
  const { canEditPost, canViewComments } = usePermissions();

  // Determine active tab based on URL
  const isEditTab = location.pathname.endsWith("/edit");
  const isCommentsTab = location.pathname.endsWith("/comments");

  // If no specific tab is in URL, default to edit tab if user has permission, otherwise comments
  const defaultTab = canEditPost() ? "edit" : "comments";

  if (!isEditTab && !isCommentsTab) {
    return <Navigate to={`/posts/${postId}/${defaultTab}`} replace />;
  }

  // Check if user has permission for the current tab
  if ((isEditTab && !canEditPost()) || (isCommentsTab && !canViewComments())) {
    return <Navigate to="/403" replace />;
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="font-medium">Error loading post</p>
            <p className="text-sm">
              {error instanceof Error ? error.message : "Post not found"}
            </p>
            <Link
              to={nav.posts.get()}
              className="text-red-700 underline mt-2 inline-block"
            >
              Return to posts
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            to={nav.posts.get()}
            className="text-blue-600 hover:text-blue-800 transition"
          >
            ← Back to Posts
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">
            {post.title}
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {canEditPost() && (
              <Link
                to={nav.postEdit.get({ id: postId })}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  isEditTab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Edit Post
              </Link>
            )}

            {canViewComments() && (
              <Link
                to={nav.postComments.get({ id: postId })}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  isCommentsTab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Comments
              </Link>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {isEditTab && <EditPostTab post={post} />}
          {isCommentsTab && <PostCommentsTab postId={postId} />}
        </div>
      </div>
    </Layout>
  );
};

export default PostPage;
