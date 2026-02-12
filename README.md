# Kanban-Board

A modern, responsive Kanban board built with React and Tailwind CSS, featuring authentication, drag-and-drop functionality, and optimistic UI updates with automatic rollback on API failures. Features

How to Run Locally Prerequisites

Node.js (v14 or higher) npm or yarn

Optimistic UI Approach

What is Optimistic UI?
Optimistic UI is a pattern where the interface updates immediately when a user takes an action, without waiting for the server response. This creates a feeling of zero-latency and improves user experience.

A React-based Kanban board with optimistic UI updates, drag-and-drop functionality, and robust error handling.

Features
Mock authentication with session persistence
Drag-and-drop task management across three columns (To Do, In Progress, Done)
Optimistic UI updates for instant feedback
Automatic rollback on API failures
Toast notifications for errors
Responsive design with Tailwind CSS
Setup Instructions
Prerequisites
Node.js (v14 or higher)
npm or yarn
Installation
Navigate to the project directory:
cd kanban-board
Install dependencies: npm install
3.Install Tailwind CSS

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

Configure Tailwind (if not already done)

Update src/index.css

css @tailwind base;
   @tailwind components;
   @tailwind utilities;

Run the development server

```bash

4. npm run dev

Open in browser

Navigate to http://localhost:5173
Enter any username/email to login
Start managing your tasks!

5. Open your browser and visit:
http://localhost:3000


## Project Structure

kanban-board/ ├── public/ │ └── index.html ├── src/ │ ├--LoginPage.jsx │ │── Toast.jsx │ ├── api/ │ │ └── mockApi.js │ ├── App.jsx │ ├── index.js │ └── index.css ├── package.json └── README.md


## How It Works

### Authentication

- Enter any non-empty username/email on the landing page
- Session persists across page refreshes using localStorage

### Task Management

- Add new tasks to the "To Do" column
- Drag and drop tasks between columns
- Delete tasks with the × button
- All actions use optimistic UI updates

### Error Handling

- Mock API has 20% random failure rate
- Failed operations show toast notifications
- UI automatically rolls back to previous state on failure

## Technologies Used

- React.js
- Tailwind CSS
- Context API for state management
- HTML5 Drag and Drop API

## Development Notes

The mock API simulates real-world scenarios with:

- 1-2 second latency on all operations
- 20% random failure rate
- Proper error responses

This demonstrates robust handling of asynchronous operations and maintaining data consistency.
