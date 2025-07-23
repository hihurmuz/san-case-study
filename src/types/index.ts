// Core type definitions for the React SPA routing and auth system

// Permission types
export type Permission =
  | "VIEW_POSTS"
  | "VIEW_COMMENTS"
  | "EDIT_POST"
  | "CREATE_POST";

// User interface
export interface User {
  name: string;
  permissions: Permission[];
}

// Route configuration interface
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
}

// Post interface matching JSONPlaceholder API structure
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// Comment interface matching JSONPlaceholder API structure
export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

// Navigation method interface
export interface NavigationMethod {
  get: (params?: Record<string, any>) => string;
  go: (params?: Record<string, any>) => void;
}

// Translation loader interface
export interface TranslationLoader {
  loadTranslations: (resources: string[]) => Promise<void>;
  isReady: (resources: string[]) => boolean;
}
