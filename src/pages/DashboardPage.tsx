import React from "react";
import { Link } from "react-router-dom";
import { useNavigation } from "@/utils/navigationGenerator";
import { usePosts } from "@/hooks/usePosts";
import { useComments } from "@/hooks/useComments";
import ContentCard from "@/components/ContentCard";
import type { Post, Comment } from "@/types/index";

const DashboardPage: React.FC = () => {
  const nav = useNavigation();

  // Fetch posts and comments data
  const {
    data: posts = [],
    isLoading: isLoadingPosts,
    error: postsError,
  } = usePosts();

  const {
    data: comments = [],
    isLoading: isLoadingComments,
    error: commentsError,
  } = useComments();

  // Get 5 most recent posts
  const recentPosts = [...posts].sort((a, b) => b.id - a.id).slice(0, 5);

  // Get 5 most recent comments
  const recentComments = [...comments].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Posts Card */}
        <ContentCard
          title="Recent Posts"
          isLoading={isLoadingPosts}
          error={postsError as Error | null}
        >
          <div className="space-y-4">
            {recentPosts.length > 0 ? (
              recentPosts.map((post: Post) => (
                <div
                  key={post.id}
                  className="border-b border-gray-100 pb-3 last:border-0"
                >
                  <Link
                    to={nav.post.get({ id: post.id })}
                    className="text-lg font-medium text-blue-600 hover:text-blue-800 transition"
                  >
                    {post.title}
                  </Link>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {post.body}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No posts available</p>
            )}
          </div>

          <div className="mt-4 pt-2">
            <Link
              to={nav.posts.get()}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View all posts →
            </Link>
          </div>
        </ContentCard>

        {/* Recent Comments Card */}
        <ContentCard
          title="Recent Comments"
          isLoading={isLoadingComments}
          error={commentsError as Error | null}
        >
          <div className="space-y-4">
            {recentComments.length > 0 ? (
              recentComments.map((comment: Comment) => (
                <div
                  key={comment.id}
                  className="border-b border-gray-100 pb-3 last:border-0"
                >
                  <Link
                    to={nav.post.get({ id: comment.postId })}
                    className="text-lg font-medium text-blue-600 hover:text-blue-800 transition"
                  >
                    {comment.name}
                  </Link>
                  <p className="text-gray-500 text-xs">By {comment.email}</p>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {comment.body}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No comments available</p>
            )}
          </div>
        </ContentCard>
      </div>
    </div>
  );
};

export default DashboardPage;
