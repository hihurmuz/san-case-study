import React from "react";
import { Link } from "react-router-dom";
import { usePosts, useDeletePost } from "@/hooks/usePosts";
import { useNavigation } from "@/utils/navigationGenerator";
import { usePermissions } from "@/hooks/usePermissions";
import Layout from "@/components/Layout";
import type { Post } from "@/types/index";

const PostsPage: React.FC = () => {
  const { data: posts = [], isLoading, error } = usePosts();
  const deletePostMutation = useDeletePost();
  const nav = useNavigation();
  const { canEditPost } = usePermissions();

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePostMutation.mutateAsync(id);
        alert("Post deleted successfully");
      } catch (error) {
        alert(
          `Error deleting post: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  };

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

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="font-medium">Error loading posts</p>
            <p className="text-sm">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Posts</h1>
          {canEditPost() && (
            <Link
              to={nav.createPost.get()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Create New Post
            </Link>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No posts available
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {posts.map((post: Post) => (
                <li key={post.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Link
                        to={nav.post.get({ id: post.id })}
                        className="text-lg font-medium text-blue-600 hover:text-blue-800 transition"
                      >
                        {post.title}
                      </Link>
                      <p className="text-gray-600 mt-1 line-clamp-2">
                        {post.body}
                      </p>
                    </div>

                    {canEditPost() && (
                      <div className="flex space-x-2 ml-4">
                        <Link
                          to={nav.postEdit.get({ id: post.id })}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                          disabled={deletePostMutation.isPending}
                        >
                          {deletePostMutation.isPending &&
                          post.id === deletePostMutation.variables
                            ? "Deleting..."
                            : "Delete"}
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
    </Layout>
  );
};

export default PostsPage;
