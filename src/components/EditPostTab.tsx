import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdatePost } from "@/hooks/usePosts";
import { editPostSchema, type EditPostFormData } from "@/schemas/postSchemas";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";
import FormButton from "@/components/forms/FormButton";
import type { Post } from "@/types/index";

interface EditPostTabProps {
  post: Post;
}

const EditPostTab: React.FC<EditPostTabProps> = ({ post }) => {
  const [successMessage, setSuccessMessage] = useState("");
  const updatePostMutation = useUpdatePost();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<EditPostFormData>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      title: post.title,
      body: post.body,
    },
  });

  const onSubmit = async (data: EditPostFormData) => {
    setSuccessMessage("");

    try {
      await updatePostMutation.mutateAsync({
        id: post.id,
        post: { title: data.title, body: data.body, userId: post.userId },
      });
      setSuccessMessage("Post updated successfully!");
    } catch (error) {
      setError("root", {
        message:
          error instanceof Error ? error.message : "Failed to update post",
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {errors.root && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded">
            {errors.root.message}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        <FormInput
          label="Title"
          placeholder="Post title"
          registration={register("title")}
          error={errors.title?.message}
          required
        />

        <FormTextarea
          label="Content"
          placeholder="Post content"
          rows={8}
          registration={register("body")}
          error={errors.body?.message}
          required
        />

        <FormButton
          type="submit"
          variant="primary"
          loading={isSubmitting || updatePostMutation.isPending}
          disabled={isSubmitting || updatePostMutation.isPending}
          className="w-full"
        >
          Save Changes
        </FormButton>
      </form>
    </div>
  );
};

export default EditPostTab;
