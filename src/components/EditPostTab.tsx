import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const [successMessage, setSuccessMessage] = useState("");
  const updatePostMutation = useUpdatePost();

  const [formData, setFormData] = useState<EditPostFormData>({
    title: post.title,
    body: post.body,
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
    setSuccessMessage("");

    const validationResult = editPostSchema.safeParse(formData);
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
      await updatePostMutation.mutateAsync({
        id: post.id,
        post: { ...validationResult.data, userId: post.userId },
      });
      setSuccessMessage(t("posts.postUpdatedSuccessfully"));
    } catch (error) {
      setErrors({
        root:
          error instanceof Error
            ? error.message
            : t("posts.updateFailed", "Failed to update post"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.root && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded">
            {errors.root}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded">
            {successMessage}
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

        <FormButton
          type="submit"
          variant="primary"
          loading={isSubmitting || updatePostMutation.isPending}
          disabled={isSubmitting || updatePostMutation.isPending}
          className="w-full"
        >
          {t("posts.saveChanges")}
        </FormButton>
      </form>
    </div>
  );
};

export default EditPostTab;
