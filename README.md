# Senior Front-end Developer Assignment

This project is a client-side-only Single Page Application (SPA) built with a clean, easy-to-understand architecture. It uses modern React technologies including Vite, TypeScript, React Router v6, and TanStack React Query v5. The core focus is on implementing a robust routing system with user access control and internationalization support, using JSONPlaceholder API for backend simulation.

## Features

- **Centralized Routing:** All route definitions are managed in a single location with a consistent structure.
- **Permission-Based Access Control:** Secure access to application pages based on user permissions.
- **Automatic Navigation System:** Navigate between routes without manually constructing URLs.
- **Authentication:** Simple dummy user login to access protected features.
- **Dashboard:** View recent posts and comments.
- **Post Management:** View, edit, delete, and create posts.
- **Internationalization (i18n):** Support for multiple languages (Turkish, English, German).
- **Offline Support (PWA):** Basic Progressive Web App features for offline experience.
- **Dark/Light Theme:** Toggle between dark and light mode.
- **Accessibility (a11y):** Enhanced accessibility features.

## Tech Stack

- **Vite:** Next-generation front-end tooling.
- **TypeScript:** Strongly typed programming language that builds on JavaScript.
- **React 18.x:** A JavaScript library for building user interfaces.
- **React Router 6.x:** Declarative routing for React.
- **TanStack React Query 5.x:** Powerful asynchronous state management.
- **Tailwind CSS:** A utility-first CSS framework.
- **Zustand:** Small, fast and scalable bearbones state-management solution.
- **i18next:** An internationalization-framework written in and for JavaScript.

## Project Structure

```
src/
├── assets/
├── components/          # Reusable UI components
├── config/             # Route and app configuration
├── hooks/              # Custom React hooks
├── i18n/
├── locales/
├── pages/              # Page components
├── providers/          # Context providers
├── schemas/
├── services/           # API and external services
├── store/
├── styles/
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/halil-ibrahim-hurmuz/react-spa-routing-auth.git
   ```
2. Navigate to the project directory:
   ```sh
   cd react-spa-routing-auth
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

### Running the Development Server

```sh
npm run dev
```

This will start the development server at `http://localhost:5173`.

## Available Routes

- `/login`: Login page.
- `/`: Dashboard with recent posts and comments.
- `/posts`: List of all posts.
- `/posts/:id`: View a single post with tabs for editing and comments.
- `/posts/:id/edit`: Edit a post.
- `/posts/:id/comments`: View comments for a post.
- `/posts/create`: Create a new post.
- `/403`: Forbidden page for unauthorized access.

## Available Permissions

- `VIEW_POSTS`
- `VIEW_COMMENTS`
- `EDIT_POST`
- `CREATE_POST`

## Dummy User

- **Name:** John Doe
- **Permissions:** `["VIEW_POSTS", "VIEW_COMMENTS"]`