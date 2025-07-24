import React from "react";
import type { Permission } from "@/types/index";

// Lazy load pages
const LoginPage = React.lazy(() => import("@/pages/LoginPage"));
const DashboardPage = React.lazy(() => import("@/pages/DashboardPage"));
const PostsPage = React.lazy(() => import("@/pages/PostsPage"));
const PostPage = React.lazy(() => import("@/pages/PostPage"));
const CreatePostPage = React.lazy(() => import("@/pages/CreatePostPage"));
const ForbiddenPage = React.lazy(() => import("@/pages/ForbiddenPage"));
const NotFoundPage = React.lazy(() => import("@/pages/NotFoundPage"));

export interface RouteConfig {
  name: string;
  path: string;
  renderer: {
    type: "element" | "lazy";
    component:
      | React.ComponentType
      | (() => Promise<{ default: React.ComponentType }>);
  };
  permissions?: Permission[];
  translations?: string[];
  isPublic?: boolean;
}

export const routesConfig: RouteConfig[] = [
  // Public routes
  {
    name: "login",
    path: "/login",
    renderer: {
      type: "lazy",
      component: LoginPage,
    },
    isPublic: true,
    translations: ["auth"],
  },
  {
    name: "forbidden",
    path: "/403",
    renderer: {
      type: "lazy",
      component: ForbiddenPage,
    },
    isPublic: true,
    translations: ["errors"],
  },
  {
    name: "notFound",
    path: "/404",
    renderer: {
      type: "lazy",
      component: NotFoundPage,
    },
    isPublic: true,
    translations: ["errors"],
  },

  // Protected routes
  {
    name: "dashboard",
    path: "/",
    renderer: {
      type: "lazy",
      component: DashboardPage,
    },
    permissions: ["VIEW_POSTS", "VIEW_COMMENTS"],
    translations: ["dashboard", "posts", "comments"],
  },
  {
    name: "posts",
    path: "/posts",
    renderer: {
      type: "lazy",
      component: PostsPage,
    },
    permissions: ["VIEW_POSTS"],
    translations: ["posts"],
  },
  {
    name: "post",
    path: "/posts/:id",
    renderer: {
      type: "lazy",
      component: PostPage,
    },
    permissions: ["VIEW_POSTS"],
    translations: ["posts", "comments"],
  },
  {
    name: "postEdit",
    path: "/posts/:id/edit",
    renderer: {
      type: "lazy",
      component: PostPage,
    },
    permissions: ["VIEW_POSTS"],
    translations: ["posts"],
  },
  {
    name: "postComments",
    path: "/posts/:id/comments",
    renderer: {
      type: "lazy",
      component: PostPage,
    },
    permissions: ["VIEW_POSTS"],
    translations: ["posts", "comments"],
  },
  {
    name: "createPost",
    path: "/posts/create",
    renderer: {
      type: "lazy",
      component: CreatePostPage,
    },
    permissions: ["CREATE_POST"],
    translations: ["posts"],
  },
];

// Helper function to get route by name
export const getRouteByName = (name: string): RouteConfig | undefined => {
  return routesConfig.find((route) => route.name === name);
};

// Helper function to get all public routes
export const getPublicRoutes = (): RouteConfig[] => {
  return routesConfig.filter((route) => route.isPublic);
};

// Helper function to get all protected routes
export const getProtectedRoutes = (): RouteConfig[] => {
  return routesConfig.filter((route) => !route.isPublic);
};
