import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useCreatePost } from "@/hooks/usePosts";
import { useNavigation } from "@/utils/navigationGenerator";
import {
  createPostSchema,
  type CreatePostFormData,
} from "@/schemas/postSchemas";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";
import FormButton from "@/components/forms/FormButton";

const CreatePostPage: React.FC = () => {
  const { t } = useTranslation();
  const createPostMutation = useCreatePost();
  const navigate = useNavigate();
  const nav = useNavigation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
  });

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      const newPost = await createPostMutation.mutateAsync({
        title: data.title,
        body: data.body,
        userId: 1, // Using dummy user ID for JSONPlaceholder API
      });

      // Navigate to the newly created post
      navigate(nav.post.get({ id: newPost.id }));
    } catch (error) {
      setError("root", {
        message:
          error instanceof Error
            ? error.message
            : t("posts.createFailed", "Failed to create post"),
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to={nav.posts.get()}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
        >
          ← {t("posts.backToPosts")}
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">
          {t("posts.createNewPostTitle")}
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {errors.root && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded">
              {errors.root.message}
            </div>
          )}

          <FormInput
            label={t("posts.postTitle")}
            placeholder={t("posts.postTitle")}
            registration={register("title")}
            error={errors.title?.message}
            required
          />

          <FormTextarea
            label={t("posts.content")}
            placeholder={t("posts.postContent")}
            rows={8}
            registration={register("body")}
            error={errors.body?.message}
            required
          />

          <div className="flex justify-end space-x-3">
            <Link
              to={nav.posts.get()}
              className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t("posts.cancel")}
            </Link>
            <FormButton
              type="submit"
              variant="primary"
              loading={isSubmitting || createPostMutation.isPending}
              disabled={isSubmitting || createPostMutation.isPending}
            >
              {t("posts.createPost")}
            </FormButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
