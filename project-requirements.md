# Senior Front-end Developer Assignment

## Introduction

We're excited to have you at this stage! This assignment should take approximately 5-6 hours to complete.

## Technical Requirements

### Core Technologies

- Vite
- TypeScript
- React 18.x
- React Router 6.x
- TanStack React Query 5.x
- Tailwind CSS (optional, but preferred)

### API

- Use [JSONPlaceholder](https://jsonplaceholder.typicode.com/) for backend simulation

### Restrictions

- No external UI libraries
- No external Form libraries

## Project Architecture

### Routing System

All routes should be defined in a single file with the following structure:

- **Name** (required): Unique identifier for navigation
- **Path** (required): URL path
- **Renderer** (required):
  - Element: Regular React component
  - Lazy-load: Dynamic import component
- **Permissions**: Access control list
- **Translations**: Pre-fetch language resources

### Authentication & Authorization

#### Available Permissions

- VIEW_POSTS
- VIEW_COMMENTS
- EDIT_POST
- CREATE_POST

#### User Structure

```typescript
const USER = {
  name: "John Doe",
  permissions: ["VIEW_POSTS", "VIEW_COMMENTS"],
};
```

### Navigation System

- Clean navigation between routes
- URL generation using route config
- Permission-based navigation control

Example Usage:

```typescript
// URL Generation
<Link to={nav.editPost.get({ id: 42 })}>Posts</Link>

// Navigation with Permission Check
<button onClick={() => nav.editPost.go({ id: 42 })}>Posts</button>
```

## Required Pages

### 1. Login Page

- Simple button for dummy user login
- Store user data in React Query state

### 2. Dashboard

- Recent 5 posts card
- Recent 5 comments card

### 3. Posts List

- Display all posts
- Edit functionality
- Delete functionality

### 4. Single Post View

Tabs (URL-based navigation):

- Edit Post
- Post Comments

### 5. Create Post

- Form for new post creation

### Common Elements

- Header with logout button
- Error pages (e.g., 403)

## Submission Requirements

1. Use Git with clear commit messages
2. Share repository link upon completion
3. No tests required

## Additional Notes

- Focus on clean architecture
- Implement proper routing system
- Handle permissions correctly
- Include internationalization support
