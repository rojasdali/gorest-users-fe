# GoRest Users Frontend

A simple Angular application for CRUD operations on user data via the GoRest API. Features include user listing, creation, editing, and deletion with a clean, responsive interface.

## Technologies Used

- **Angular 19.2** with **TypeScript**
- **Angular Material** for UI components and theming
- **RxJS** for state management and reactive data handling

## Requirements

- **Node.js**: v18.17.0 or higher (LTS recommended)
- **npm**: v9.6.0 or higher

## Project Structure

```
src/
├── app/
│   ├── features/
│   │   ├── auth/     # Login functionality
│   │   └── users/    # User CRUD operations
│   ├── core/         # Core services and interceptors
│   ├── layout/       # Layout components
│   └── shared/       # Shared components and utilities
```

## Features

- User listing with pagination and filtering
- User creation with form validation
- User details view with responsive layout
- User editing with real-time validation
- User deletion with confirmation dialog
- Toast notifications for operation feedback
- Material Design UI components
- **Optimistic UI updates** for immediate user feedback

## Core Implementation Details

- **HTTP Interceptors**:
  - **Auth Interceptor**: Automatically adds authentication tokens to outgoing requests
  - **Error Interceptor**: Handles 401 Unauthorized responses with automatic logout
  - **Loading Interceptor**: Manages global loading state during API requests
- **Optimistic Updates**:
  - User actions reflect immediately in the UI before server confirmation
  - Graceful rollback handling if server requests fail
  - Improves perceived performance by eliminating wait times

## ⚠️ Known Issues & Gotchas (Needs Immediate Attention)

- **Test Failures in User Table Component**:

  - Disabled unit tests for UserTable component due to `matRowDefTrackBy` compatibility issues
  - Angular Material's `matRowDefTrackBy` implementation conflicting with test environment
  - Decision made to prioritize build stability over test coverage temporarily
  - **Resolution Plan**: Refactor component to use simpler tracking or upgrade test harness

- **Vercel Deployment Challenges**:
  - Environment variables not properly injected during Angular builds on Vercel
  - First-time deployment of Angular to Vercel revealed platform-specific configuration issues
  - Angular's environment.ts file not properly substituted during Vercel's build process
  - **Workaround**: Using runtime config loading instead of build-time env substitution
  - **Resolution Plan**: Create custom Vercel build command that properly handles Angular environment substitution

## Setup and Running Locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/gorest-users-fe.git
   cd gorest-users-fe
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:4200`

> Note: API credentials are currently hardcoded for development purposes.

## Authentication

For testing purposes, use these credentials:

- **Username**: admin
- **Password**: MoCaFi

## GoRest API Notes

The application uses the [GoRest API](https://gorest.co.in/public/v2/users) which provides:

- **Rate Limiting**: API limits requests with headers:

  - `X-RateLimit-Limit`: Allowed requests per minute
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Seconds until reset

- **Pagination Headers**:

  - `X-Pagination-Total`: Total number of results
  - `X-Pagination-Pages`: Total number of pages
  - `X-Pagination-Page`: Current page number
  - `X-Pagination-Limit`: Results per page

- **Authentication**: Uses Bearer token authentication
  - API requests for PUT, POST, PATCH, DELETE require authorization

## Next Steps

- Implement comprehensive test coverage
- Properly secure API tokens for production
- Add more robust error handling
  - Enhance the auto-logout mechanism with session expiry warnings
  - Implement refresh token functionality to prevent unnecessary logouts
- Improve accessibility
- Enhance mobile responsiveness
- Implement data caching for better performance
- Handle API rate limiting with exponential backoff
- Implement GraphQL support option

## API Documentation

This application uses the [GoRest API](https://gorest.co.in/public/v2/users) for user management operations.
