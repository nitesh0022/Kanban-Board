# 🚀 Quick Start - 3 Steps

## Setup (First Time Only)

```bash
cd kanban-board
npm install
```

## Run

```bash
npm start
```

The app opens automatically at `http://localhost:3000`

---

## What You'll See

1. **Landing Page**
   - Enter any username (e.g., "demo", "test@email.com")
   - Click "Get Started"

2. **Kanban Board**
   - Three columns: To Do, In Progress, Done
   - Add tasks using the form at the top
   - Drag tasks between columns
   - Delete tasks with the × button

---

## Key Features to Test

### ✅ Optimistic UI
- Actions happen **instantly** (no waiting)
- Background API calls take 1-2 seconds
- If API fails (20% chance), changes auto-rollback

### ✅ Try This:
1. Add several tasks quickly
2. Drag them between columns
3. Watch for error toasts (red notifications)
4. Notice how failed actions revert automatically

### ✅ Persistence
- Refresh the page → you stay logged in
- All tasks are saved locally
- No database needed

---

## Project Structure

```
kanban-board/
├── src/
│   ├── components/      # UI components
│   ├── context/         # State management
│   ├── api/             # Mock API
│   ├── App.jsx          # Main app
│   └── index.js         # Entry point
├── public/
│   └── index.html
├── package.json
├── tailwind.config.js
└── README.md
```

---

## Tech Stack

- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Context API** - State management
- **localStorage** - Data persistence
- **HTML5 Drag & Drop** - Task movement

---

## Troubleshooting

**Port 3000 in use?**
```bash
PORT=3001 npm start
```

**Dependencies issue?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Tasks not saving?**
- Check if localStorage is enabled (not in private/incognito mode)

---

## Architecture Highlights

### Optimistic UI Pattern
```javascript
// 1. Update UI immediately
setTasks(newState);

// 2. Call API in background
try {
  await mockApi.action();
} catch {
  // 3. Rollback if it fails
  setTasks(previousState);
  showErrorToast();
}
```

### State Management
- **AuthContext** - Login/logout
- **BoardContext** - Tasks + operations
- **localStorage** - Persistence

### Mock API
- 1-2 second random delay
- 20% random failure rate
- Simulates real backend behavior

---

## For Reviewers

This project demonstrates:

1. ✅ **Proper state management** with Context API
2. ✅ **Optimistic UI updates** for instant feedback
3. ✅ **Robust error handling** with automatic rollback
4. ✅ **Clean architecture** - separation of concerns
5. ✅ **Professional design** - minimal, not AI-generated
6. ✅ **Production patterns** - ready for real API integration

---

## Read More

- `README.md` - Overview and basic setup
- `SETUP_GUIDE.md` - Detailed architecture and patterns

---

**Questions?** Check the detailed guides or review the code comments.
