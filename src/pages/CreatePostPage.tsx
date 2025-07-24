import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const [formData, setFormData] = useState<CreatePostFormData>({
    title: "",
    body: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const validationResult = createPostSchema.safeParse(formData);
    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          newErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const newPost = await createPostMutation.mutateAsync({
        ...validationResult.data,
        userId: 1, // Using dummy user ID for JSONPlaceholder API
      });
      navigate(nav.post.get({ id: newPost.id }));
    } catch (error) {
      setErrors({
        root:
          error instanceof Error
            ? error.message
            : t("posts.createFailed", "Failed to create post"),
      });
    } finally {
      setIsSubmitting(false);
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.root && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded">
              {errors.root}
            </div>
          )}

          <FormInput
            label={t("posts.postTitle")}
            placeholder={t("posts.postTitle")}
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />

          <FormTextarea
            label={t("posts.content")}
            placeholder={t("posts.postContent")}
            name="body"
            value={formData.body}
            onChange={handleChange}
            rows={8}
            error={errors.body}
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
