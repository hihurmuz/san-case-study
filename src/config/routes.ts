import { RouteConfig } from "@/types";

// Route configuration - single source of truth for all application routes
export const routeConfigs: RouteConfig[] = [
  {
    name: "login",
    path: "/login",
    renderer: {
      type: "lazy",
      component: () => import("@/pages/LoginPage"),
    },
  },
  {
    name: "dashboard",
    path: "/",
    renderer: {
      type: "lazy",
      component: () => import("@/pages/DashboardPage"),
    },
    permissions: ["VIEW_POSTS", "VIEW_COMMENTS"],
  },
  {
    name: "posts",
    path: "/posts",
    renderer: {
      type: "lazy",
      component: () => import("@/pages/PostsPage"),
    },
    permissions: ["VIEW_POSTS"],
  },
  {
    name: "post",
    path: "/posts/:id",
    renderer: {
      type: "lazy",
      component: () => import("@/pages/PostPage"),
    },
    permissions: ["VIEW_POSTS"],
  },
  {
    name: "postEdit",
    path: "/posts/:id/edit",
    renderer: {
      type: "lazy",
      component: () => import("@/pages/PostPage"),
    },
    permissions: ["EDIT_POST"],
  },
  {
    name: "postComments",
    path: "/posts/:id/comments",
    renderer: {
      type: "lazy",
      component: () => import("@/pages/PostPage"),
    },
    permissions: ["VIEW_COMMENTS"],
  },
  {
    name: "createPost",
    path: "/posts/create",
    renderer: {
      type: "lazy",
      component: () => import("@/pages/CreatePostPage"),
    },
    permissions: ["CREATE_POST"],
  },
  {
    name: "forbidden",
    path: "/403",
    renderer: {
      type: "lazy",
      component: () => import("@/pages/ForbiddenPage"),
    },
  },
];

// Route names type for type safety
export type RouteNames = (typeof routeConfigs)[number]["name"];
