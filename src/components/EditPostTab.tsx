import React, { useState } from "react";
import { useUpdatePost } from "@/hooks/usePosts";
import type { Post } from "@/types/index";

interface EditPostTabProps {
  post: Post;
}

const EditPostTab: React.FC<EditPostTabProps> = ({ post }) => {
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const updatePostMutation = useUpdatePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

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
      await updatePostMutation.mutateAsync({
        id: post.id,
        post: { title, body, userId: post.userId },
      });
      setSuccessMessage("Post updated successfully!");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to update post"
      );
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {formError}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {successMessage}
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

        <div>
          <button
            type="submit"
            disabled={updatePostMutation.isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {updatePostMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPostTab;
