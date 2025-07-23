import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCreatePost } from "@/hooks/usePosts";
import { useNavigation } from "@/utils/navigationGenerator";
import Layout from "@/components/Layout";

const CreatePostPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [formError, setFormError] = useState("");

  const createPostMutation = useCreatePost();
  const navigate = useNavigate();
  const nav = useNavigation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validate form
    if (!title.trim()) {
      setFormError("Title is required");
      return;
    }

    if (!body.trim()) {
      setFormError("Content is required");
      return;
    }

    try {
      const newPost = await createPostMutation.mutateAsync({
        title,
        body,
        userId: 1, // Using dummy user ID for JSONPlaceholder API
      });

      // Navigate to the newly created post
      navigate(nav.post.get({ id: newPost.id }));
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to create post"
      );
    }
  };

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
            Create New Post
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {formError}
              </div>
            )}

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Post title"
              />
            </div>

            <div>
              <label
                htmlFor="body"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Content
              </label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Post content"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Link
                to={nav.posts.get()}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={createPostMutation.isPending}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {createPostMutation.isPending ? "Creating..." : "Create Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePostPage;
